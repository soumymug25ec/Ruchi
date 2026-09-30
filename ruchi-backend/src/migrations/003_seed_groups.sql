-- Ruchi Platform - Seed Groups (003)
-- Creates one group per interest category for each institution.

INSERT INTO groups (institution_id, category_id, name, description, member_count)
SELECT i.id, c.id, c.name, c.description, 0
FROM institutions i
CROSS JOIN interest_categories c
ON CONFLICT (institution_id, category_id) DO NOTHING;
