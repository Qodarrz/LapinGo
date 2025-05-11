import jwt from "jsonwebtoken";
import pool from "../services/db.js";

exports.getAllAchievements = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        b.name as badge_name,
        b.icon as badge_icon,
        b.color as badge_color
      FROM achievements a
      LEFT JOIN badges b ON a.badge_id = b.badge_id
    `;
    const { rows: achievements } = await pool.query(query);
    
    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user achievements
exports.getUserAchievements = async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = `
      SELECT 
        ua.*,
        a.name,
        a.description,
        a.icon,
        a.criteria,
        a.required_count,
        a.xp_reward,
        b.name as badge_name,
        b.icon as badge_icon,
        b.color as badge_color
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.achievement_id
      LEFT JOIN badges b ON a.badge_id = b.badge_id
      WHERE ua.user_id = $1
    `;
    const { rows: achievements } = await pool.query(query, [user_id]);

    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check and update achievements
exports.checkAchievements = async (userId, activityType) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update user stats based on activity
    await updateUserStats(client, userId, activityType);

    // Get relevant achievements
    const achievementsQuery = `
      SELECT * FROM achievements
      WHERE criteria = $1
    `;
    const { rows: achievements } = await client.query(achievementsQuery, [activityType]);

    for (const achievement of achievements) {
      // Get or create user achievement record
      let userAchievementQuery = `
        SELECT * FROM user_achievements
        WHERE user_id = $1 AND achievement_id = $2
        LIMIT 1
      `;
      let { rows: [userAchievement] } = await client.query(userAchievementQuery, [userId, achievement.achievement_id]);

      if (!userAchievement) {
        const insertQuery = `
          INSERT INTO user_achievements
          (user_id, achievement_id, progress, unlocked)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        const { rows } = await client.query(insertQuery, [
          userId,
          achievement.achievement_id,
          0,
          false
        ]);
        userAchievement = rows[0];
      }

      // Skip if already unlocked
      if (userAchievement.unlocked) continue;

      // Get current count from user_stats
      const userStatQuery = `
        SELECT * FROM user_stats
        WHERE user_id = $1
        LIMIT 1
      `;
      const { rows: [userStat] } = await client.query(userStatQuery, [userId]);

      const statField = `${activityType}_count`;
      const currentCount = userStat ? (userStat[statField] || 0) : 0;
      const newProgress = Math.min(currentCount, achievement.required_count);

      // Update progress
      await client.query(`
        UPDATE user_achievements
        SET progress = $1
        WHERE user_id = $2 AND achievement_id = $3
      `, [newProgress, userId, achievement.achievement_id]);

      // Check if achievement is unlocked
      if (currentCount >= achievement.required_count) {
        await client.query(`
          UPDATE user_achievements
          SET unlocked = true, unlocked_at = NOW()
          WHERE user_id = $1 AND achievement_id = $2
        `, [userId, achievement.achievement_id]);

        // Add XP reward
        await client.query(`
          UPDATE user_stats
          SET total_xp = total_xp + $1
          WHERE user_id = $2
        `, [achievement.xp_reward, userId]);

        // Award badge if exists
        if (achievement.badge_id) {
          await awardBadge(client, userId, achievement.badge_id);
        }

        // Check level up
        await checkLevelUp(client, userId);
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error checking achievements:', error);
  } finally {
    client.release();
  }
};

// Helper function to update user stats
async function updateUserStats(client, userId, activityType) {
  const statField = `${activityType}_count`;
  
  await client.query(`
    UPDATE user_stats
    SET ${statField} = ${statField} + 1
    WHERE user_id = $1
  `, [userId]);
}

// Helper function to check level up
async function checkLevelUp(client, userId) {
  const userStatQuery = `
    SELECT * FROM user_stats
    WHERE user_id = $1
    LIMIT 1
  `;
  const { rows: [userStat] } = await client.query(userStatQuery, [userId]);

  if (!userStat) return;

  // Simple leveling formula: 100 XP per level
  const newLevel = Math.floor(userStat.total_xp / 100) + 1;
  
  if (newLevel > userStat.level) {
    await client.query(`
      UPDATE user_stats
      SET level = $1
      WHERE user_id = $2
    `, [newLevel, userId]);
  }
}

// Helper function to award badge (assuming this exists)
async function awardBadge(client, userId, badgeId) {
  // Implement your badge awarding logic here
  // Example:
  await client.query(`
    INSERT INTO user_badges (user_id, badge_id, awarded_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING
  `, [userId, badgeId]);
}