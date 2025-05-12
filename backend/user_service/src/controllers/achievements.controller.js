import pool from "../services/db.js";
import axios from "axios";

export class AchievementController {
  constructor() {
    this.pool = pool;
    this.achievementTypes = {
      POST: {
        TOTAL: "post_count",
        TEXT: "text_post_count",
        IMAGE: "image_post_count",
        VIDEO: "video_post_count",
        POLLING: "polling_post_count",
      },
      INTERACTION: {
        LIKES_GIVEN: "likes_given",
        LIKES_RECEIVED: "likes_received",
        COMMENTS_GIVEN: "comments_given",
        COMMENTS_RECEIVED: "comments_received",
        REPLIES_GIVEN: "replies_given",
      },
      COMMUNITY: {
        REPORTS: "reports_given",
        POLL_VOTES: "poll_votes_given",
      },
    };
  }

  async getAllAchievements(req, res) {
    try {
      const query = `
        SELECT 
          a.*,
          b.name as badge_name,
          b.icon as badge_icon,
          b.color as badge_color,
          b.xp_value as badge_xp
        FROM achievements a
        LEFT JOIN badges b ON a.badge_id = b.badge_id
        ORDER BY a.required_count ASC
      `;
      const [achievements] = await this.pool.query(query);
      res.json({ success: true, data: achievements });
    } catch (error) {
      console.error("Error getting achievements:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get achievements" });
    }
  }

  async getUserAchievements(req, res) {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT 
          a.*,
          ua.progress,
          ua.unlocked,
          ua.unlocked_at,
          b.name as badge_name,
          b.icon as badge_icon,
          b.color as badge_color
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.achievement_id = ua.achievement_id AND ua.user_id = ?
        LEFT JOIN badges b ON a.badge_id = b.badge_id
        ORDER BY ua.unlocked DESC, a.required_count ASC
      `;

      const [achievements] = await this.pool.query(query, [user_id]);

      res.json({
        success: true,
        data: achievements.map((ach) => ({
          ...ach,
          progress: ach.progress || 0,
          unlocked: ach.unlocked || false,
        })),
      });
    } catch (error) {
      console.error("Error getting user achievements:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get user achievements" });
    }
  }

  async syncUserStats(req, res) {
    const conn = await this.pool.getConnection();
    try {
      const user_id = req.user.id;
      await conn.query("START TRANSACTION");

      // 1. Fetch stats from external services
      const [postStats, interactionStats] = await Promise.all([
        this.#fetchPostStats(user_id, req.headers.authorization),
        this.#fetchInteractionStats(user_id, req.headers.authorization),
      ]);

      // 2. Update user_stats - MySQL version
      await conn.query(
        `
        INSERT INTO user_stats (
          user_id,
          post_count, text_post_count, image_post_count, video_post_count, polling_post_count,
          likes_given, likes_received, comments_given, comments_received, replies_given,
          reports_given, poll_votes_given
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          post_count = VALUES(post_count),
          text_post_count = VALUES(text_post_count),
          image_post_count = VALUES(image_post_count),
          video_post_count = VALUES(video_post_count),
          polling_post_count = VALUES(polling_post_count),
          likes_given = VALUES(likes_given),
          likes_received = VALUES(likes_received),
          comments_given = VALUES(comments_given),
          comments_received = VALUES(comments_received),
          replies_given = VALUES(replies_given),
          reports_given = VALUES(reports_given),
          poll_votes_given = VALUES(poll_votes_given),
          updated_at = NOW()
      `,
        [
          user_id,
          postStats.total || 0,
          postStats.text || 0,
          postStats.image || 0,
          postStats.video || 0,
          postStats.polling || 0,
          interactionStats.likes_given || 0,
          interactionStats.likes_received || 0,
          interactionStats.comments || 0,
          interactionStats.comments_received || 0,
          interactionStats.replies || 0,
          interactionStats.reports || 0,
          interactionStats.poll_votes || 0,
        ]
      );

      // 3. Check all possible achievements
      await this.#checkAllAchievements(conn, user_id);

      await conn.query("COMMIT");

      // 4. Return updated achievements

      // Dalam syncUserStats(), sebelum res.json()
      const [unlockedAchievements] = await conn.query(
        `SELECT a.* 
   FROM user_achievements ua
   JOIN achievements a ON ua.achievement_id = a.achievement_id
   WHERE ua.user_id = ? AND ua.unlocked = true`,
        [user_id]
      );

      res.json({
        success: true,
        data: {
          user_id,
          unlocked_achievements: unlockedAchievements, // <-- Tambahkan ini
          stats: {
            posts: postStats,
            interactions: interactionStats,
          },
        },
      });
    } catch (error) {
      await conn.query("ROLLBACK");
      console.error("Sync failed:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    } finally {
      conn.release();
    }
  }

  // Private helper methods
  async #fetchPostStats(userId, authHeader) {
    try {
      const response = await axios.get(
        `${process.env.POST_SERVICE}/api/postingan/count/user/${userId}`,
        { headers: { Authorization: authHeader } }
      );

      const data = response.data.data || {};
      return {
        total: data.posts?.total || 0,
        text: data.posts?.by_type?.text || 0,
        image: data.posts?.by_type?.image || 0,
        video: data.posts?.by_type?.video || 0,
        polling: data.posts?.by_type?.polling || 0,
      };
    } catch (error) {
      console.error("Failed to fetch post stats:", error.message);
      return {
        total: 0,
        text: 0,
        image: 0,
        video: 0,
        polling: 0,
      };
    }
  }

  async #fetchInteractionStats(userId, authHeader) {
    try {
      const response = await axios.get(
        `${process.env.INTERACTION_SERVICE}/api/postingan/count/user/${userId}`,
        { headers: { Authorization: authHeader } }
      );

      const data = response.data.data || {};
      return {
        likes_given: data.interactions?.likes_given || 0,
        likes_received: data.interactions?.likes_received || 0,
        comments: data.interactions?.comments || 0,
        comments_received: data.interactions?.comments_on_posts || 0,
        replies: data.interactions?.replies || 0,
        reports: data.community?.reports || 0,
        poll_votes: data.community?.poll_votes || 0,
      };
    } catch (error) {
      console.error("Failed to fetch interaction stats:", error.message);
      return {
        likes_given: 0,
        likes_received: 0,
        comments: 0,
        comments_received: 0,
        replies: 0,
        reports: 0,
        poll_votes: 0,
      };
    }
  }

  async #checkAllAchievements(conn, userId) {
    try {
      // Get user's current stats
      const [userStats] = await conn.query(
        "SELECT * FROM user_stats WHERE user_id = ?",
        [userId]
      );

      if (!userStats || userStats.length === 0) return;

      // Get all possible achievements
      const [allAchievements] = await conn.query("SELECT * FROM achievements");

      // Check each achievement
      for (const achievement of allAchievements) {
        const statField = this.#getStatField(
          achievement.criteria_type,
          achievement.criteria_subtype
        );
        const currentCount = userStats[0][statField] || 0;
        const requiredCount = achievement.required_count;

        // Check if achievement is already unlocked
        const [existing] = await conn.query(
          `SELECT * FROM user_achievements 
           WHERE user_id = ? AND achievement_id = ?`,
          [userId, achievement.achievement_id]
        );

        if (existing.length > 0 && existing[0].unlocked) continue;

        // Calculate progress (percentage)
        const progress = Math.min(
          Math.floor((currentCount / requiredCount) * 100),
          100
        );

        if (!existing || existing.length === 0) {
          // Create new user achievement record
          await conn.query(
            `INSERT INTO user_achievements 
             (user_id, achievement_id, progress, unlocked)
             VALUES (?, ?, ?, ?)`,
            [
              userId,
              achievement.achievement_id,
              progress,
              currentCount >= requiredCount,
            ]
          );
        } else {
          // Update existing record
          await conn.query(
            `UPDATE user_achievements 
             SET progress = ? 
             WHERE user_id = ? AND achievement_id = ?`,
            [progress, userId, achievement.achievement_id]
          );
        }

        // Check if achievement should be unlocked
        if (
          currentCount >= requiredCount &&
          (!existing || existing.length === 0 || !existing[0].unlocked)
        ) {
          await this.#unlockAchievement(conn, userId, achievement);
        }
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
      throw error;
    }
  }

  async #unlockAchievement(conn, userId, achievement) {
    await conn.query("START TRANSACTION");

    try {
      // Mark as unlocked
      await conn.query(
        `UPDATE user_achievements 
         SET unlocked = true, unlocked_at = NOW(), progress = 100
         WHERE user_id = ? AND achievement_id = ?`,
        [userId, achievement.achievement_id]
      );

      // Add XP reward
      if (achievement.xp_reward > 0) {
        await conn.query(
          `UPDATE user_stats 
           SET total_xp = total_xp + ? 
           WHERE user_id = ?`,
          [achievement.xp_reward, userId]
        );
      }

      // Award badge if exists
      if (achievement.badge_id) {
        await conn.query(
          `INSERT INTO user_badges (user_id, badge_id, earned_at)
           VALUES (?, ?, NOW())
           ON DUPLICATE KEY UPDATE earned_at = VALUES(earned_at)`,
          [userId, achievement.badge_id]
        );
      }

      // Check level up
      await this.#checkLevelUp(conn, userId);

      await conn.query("COMMIT");
    } catch (error) {
      await conn.query("ROLLBACK");
      throw error;
    }
  }

  async #checkLevelUp(conn, userId) {
    const [userStats] = await conn.query(
      "SELECT total_xp, level FROM user_stats WHERE user_id = ?",
      [userId]
    );

    if (!userStats || userStats.length === 0) return;

    // Simple leveling formula: 100 XP per level
    const newLevel = Math.floor(userStats[0].total_xp / 100) + 1;

    if (newLevel > userStats[0].level) {
      await conn.query("UPDATE user_stats SET level = ? WHERE user_id = ?", [
        newLevel,
        userId,
      ]);
    }
  }

  #getStatField(type, subtype) {
    if (type === "POST") {
      return this.achievementTypes.POST[subtype] || "post_count";
    } else if (type === "INTERACTION") {
      return this.achievementTypes.INTERACTION[subtype] || "likes_given";
    } else if (type === "COMMUNITY") {
      return this.achievementTypes.COMMUNITY[subtype] || "reports_given";
    }
    return "post_count"; // default
  }
}
