-- Database schemas for the SPA + CMS project
--
-- These schemas replace the JSON-file storage used in the
-- tutorial with a proper relational database (PostgreSQL).
--
-- Two main tables: pages (CMS content) and messages (contact form).

-- --------------------------------
-- Table: pages
-- Each row is a single page with
-- a JSONB column for flexible blocks.
-- --------------------------------

CREATE TABLE IF NOT EXISTS pages (
    id          SERIAL PRIMARY KEY,
    key         VARCHAR(128) UNIQUE NOT NULL,  -- machine-readable slug, e.g. 'home', 'about'
    title       VARCHAR(255) NOT NULL,
    blocks      JSONB NOT NULL DEFAULT '[]',    -- array of block objects
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pages_key ON pages (key);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Seed data matching the tutorial config.json
INSERT INTO pages (key, title, blocks) VALUES
    ('home', 'Home', '[{"type":"hero","text":"Welcome to My Site"},{"type":"text","content":"This is a config-driven single-page application."}]'),
    ('about', 'About', '[{"type":"text","content":"Built with a config-driven CMS pattern."}]'),
    ('contact', 'Contact', '[{"type":"text","content":"Get in touch using the form below."},{"type":"contact-form","endpoint":"/api/contact"}]'),
    ('blog', 'Blog', '[{"type":"text","content":"Welcome to the blog."}]')
ON CONFLICT (key) DO NOTHING;


-- --------------------------------
-- Table: messages
-- Stores contact form submissions
-- after Turnstile verification.
-- --------------------------------

CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    turnstile_valid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_created_at ON messages (created_at DESC);


-- --------------------------------
-- Table: site_config
-- Key-value store for site-level
-- settings (title, description, etc.)
-- --------------------------------

CREATE TABLE IF NOT EXISTS site_config (
    key         VARCHAR(128) PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_config (key, value) VALUES
    ('title', 'My SPA Site'),
    ('description', 'A config-driven single-page application')
ON CONFLICT (key) DO NOTHING;


-- RLS / multi-tenant support (optional)
-- ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
