/********************
 * Node-pg-migrate migration: initial schema
 * Run with:
 *  - Linux/Mac:   npm run db:migrate -w apps/api
 *  - Windows:     npm run db:migrate:ts -w apps/api
 ********************/

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  // Ensure UUID generation is available (Supabase supports gen_random_uuid)
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  // Users
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    email: { type: "text", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    first_name: { type: "text" },
    last_name: { type: "text" },
    deleted_at: { type: "timestamptz" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Profiles
  pgm.createTable("profiles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: "users",
      onDelete: "cascade",
    },
    age: { type: "integer" },
    sex: { type: "text" },
    height_cm: { type: "integer" },
    weight_kg: { type: "integer" },
    country: { type: "text" },
    currency: { type: "text" },
    unit_system: { type: "text" }, // metric | imperial
  });

  // OTP Codes
  pgm.createTable("otp_codes", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    email: { type: "text", notNull: true },
    code_hash: { type: "text", notNull: true },
    purpose: { type: "text", notNull: true }, // verify | reset
    expires_at: { type: "timestamptz", notNull: true },
    consumed_at: { type: "timestamptz" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createIndex("otp_codes", ["email", "purpose"]);

  // Refresh Tokens
  pgm.createTable("refresh_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    token_hash: { type: "text", notNull: true },
    expires_at: { type: "timestamptz", notNull: true },
    revoked_at: { type: "timestamptz" },
    user_agent: { type: "text" },
    ip: { type: "text" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createIndex("refresh_tokens", ["user_id"]);
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = (pgm) => {
  pgm.dropTable("refresh_tokens");
  pgm.dropTable("otp_codes");
  pgm.dropTable("profiles");
  pgm.dropTable("users");
};
