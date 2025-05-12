exports.up = async function (knex) {
  await knex.schema.dropTableIfExists("users").createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username").notNullable().unique();
    table.string("first_name").nullable();
    table.string("last_name").nullable();
    table.text("avatar").defaultTo(null);
    table.string("email").notNullable().unique();
    table.bigInteger("phone").unique().nullable();
    table.enu("role", ["guest", "admin"]).notNullable().defaultTo("guest");
    table.string("password").notNullable();
    table.text("password_reset_token").nullable();
    table.text("google_id").nullable();
    table.text("verify_email_token").nullable();
    table.boolean("status").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("badges", (table) => {
    table.increments("badge_id").primary();
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.string("icon").notNullable();
    table.string("color").notNullable().defaultTo("#3a86ff");
    table.integer("xp_value").notNullable().defaultTo(10);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("achievements", (table) => {
    table.increments("achievement_id").primary();
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.string("icon").notNullable();
    table.string("criteria_type").notNullable(); // e.g., 'post_count', 'like_received'
    table.string("criteria_subtype").nullable(); // e.g., 'image', 'video' for posts
    table.integer("required_count").notNullable();
    table.integer("badge_id").unsigned().nullable().references("badge_id").inTable("badges");
    table.integer("xp_reward").notNullable().defaultTo(50);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("user_achievements", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onDelete("CASCADE");
    table.integer("achievement_id").unsigned().notNullable().references("achievement_id").inTable("achievements").onDelete("CASCADE");
    table.integer("progress").notNullable().defaultTo(0);
    table.boolean("unlocked").notNullable().defaultTo(false);
    table.timestamp("unlocked_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "achievement_id"]);
  });

  await knex.schema.createTable("user_badges", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onDelete("CASCADE");
    table.integer("badge_id").unsigned().notNullable().references("badge_id").inTable("badges").onDelete("CASCADE");
    table.timestamp("earned_at").defaultTo(knex.fn.now());
    table.boolean("is_featured").defaultTo(false);
    table.unique(["user_id", "badge_id"]);
  });

  await knex.schema.createTable("user_activities", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onDelete("CASCADE");
    table.string("activity_type").notNullable();
    table.jsonb("metadata").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("user_stats", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onDelete("CASCADE").unique();
    // Post stats
    table.integer("post_count").defaultTo(0);
    table.integer("text_post_count").defaultTo(0);
    table.integer("image_post_count").defaultTo(0);
    table.integer("video_post_count").defaultTo(0);
    table.integer("polling_post_count").defaultTo(0);
    // Interaction stats
    table.integer("likes_given").defaultTo(0);
    table.integer("likes_received").defaultTo(0);
    table.integer("comments_given").defaultTo(0);
    table.integer("comments_received").defaultTo(0);
    table.integer("replies_given").defaultTo(0);
    // Community stats
    table.integer("reports_given").defaultTo(0);
    table.integer("poll_votes_given").defaultTo(0);
    // Level and XP
    table.integer("total_xp").defaultTo(0);
    table.integer("level").defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("user_stats");
  await knex.schema.dropTableIfExists("user_activities");
  await knex.schema.dropTableIfExists("user_badges");
  await knex.schema.dropTableIfExists("user_achievements");
  await knex.schema.dropTableIfExists("achievements");
  await knex.schema.dropTableIfExists("badges");
  await knex.schema.dropTableIfExists("users");
};