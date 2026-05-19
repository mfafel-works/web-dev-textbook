-- SQLite schema (for portable / embedded use)
-- Compatible with the same structure as the PostgreSQL schema.

CREATE TABLE IF NOT EXISTS pages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    key         TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    blocks      TEXT NOT NULL DEFAULT '[]',
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_pages_key ON pages (key);

CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    turnstile_valid INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_config (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
