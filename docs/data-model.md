# QuickNotes Data Model

## 1. Overview

QuickNotes uses a relational database to store users, notes, tags, and the relationships between notes and tags. The database uses primary keys to identify records and foreign keys to maintain referential integrity.

## 2. Entities and Columns

### Users

| Column        | Type         | Key / Description     |
| ------------- | ------------ | --------------------- |
| id            | BIGINT       | Primary key           |
| name          | VARCHAR(100) | User's display name   |
| email         | VARCHAR(255) | Unique email address  |
| password_hash | VARCHAR(255) | Secure password hash  |
| created_at    | TIMESTAMP    | Account creation time |

### Notes

| Column     | Type         | Key / Description                |
| ---------- | ------------ | -------------------------------- |
| id         | BIGINT       | Primary key                      |
| user_id    | BIGINT       | Foreign key referencing users.id |
| title      | VARCHAR(100) | Required note title              |
| body       | TEXT         | Optional note content            |
| created_at | TIMESTAMP    | Creation time                    |
| updated_at | TIMESTAMP    | Last update time                 |

### Tags

| Column     | Type        | Key / Description                |
| ---------- | ----------- | -------------------------------- |
| id         | BIGINT      | Primary key                      |
| user_id    | BIGINT      | Foreign key referencing users.id |
| name       | VARCHAR(50) | Tag name                         |
| created_at | TIMESTAMP   | Creation time                    |

### Note_Tags

| Column     | Type      | Key / Description                                               |
| ---------- | --------- | --------------------------------------------------------------- |
| note_id    | BIGINT    | Foreign key referencing notes.id; part of composite primary key |
| tag_id     | BIGINT    | Foreign key referencing tags.id; part of composite primary key  |
| created_at | TIMESTAMP | Time the tag was attached                                       |

The composite primary key `(note_id, tag_id)` prevents the same tag from being attached to the same note more than once.

## 3. Relationships

* **Users to Notes — one-to-many:** One user can own many notes. Each note belongs to one user.
* **Users to Tags — one-to-many:** One user can create many tags. Each tag belongs to one user.
* **Notes to Tags — many-to-many:** A note can have several tags, and a tag can be attached to several notes. The `note_tags` junction table represents this relationship.

Foreign keys enforce relationships and prevent orphaned records. Deleting a user removes their notes and tags; deleting a note or tag removes its associated junction records.

## 4. SQL Table Definitions

The following statements use PostgreSQL syntax.

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Example SQL Queries

### Query 1: List a user's notes

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC
LIMIT 20;
```

This query returns the latest notes for one user.

### Query 2: Find notes with a particular title

```sql
SELECT id, title, body
FROM notes
WHERE user_id = 1
  AND title ILIKE '%project%';
```

This query searches a user's note titles without regard to letter case.

### Query 3: List notes and their tags (JOIN)

```sql
SELECT n.id, n.title, t.name AS tag_name
FROM notes AS n
JOIN note_tags AS nt ON nt.note_id = n.id
JOIN tags AS t ON t.id = nt.tag_id
WHERE n.user_id = 1
ORDER BY n.id, t.name;
```

This query joins all three tables to show which tags belong to each note.

### Query 4: Count notes per user

```sql
SELECT u.id, u.name, COUNT(n.id) AS note_count
FROM users AS u
LEFT JOIN notes AS n ON n.user_id = u.id
GROUP BY u.id, u.name
ORDER BY note_count DESC;
```

The `LEFT JOIN` includes users who have not created any notes.

## 6. Indexes

```sql
CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at DESC);
```

This index helps the common operation of listing one user's notes in most recently updated order. It reduces the work required to find and sort those records as the database grows.

The unique constraints on `users.email` and `(user_id, name)` in `tags`, along with the primary keys, also create indexes in PostgreSQL.

## 7. SQL vs NoSQL Decision

I recommend PostgreSQL, a relational SQL database, for QuickNotes. Users, notes, tags, and note-tag relationships have clear structures and integrity requirements. Foreign keys and transactions help ensure that notes and tags remain consistent when records are created or deleted. SQL also supports joins and reporting queries. At one million users, PostgreSQL can scale through appropriate indexes, connection pooling, read replicas, caching, and database optimization. NoSQL could be useful for specific high-volume workloads later, but a relational database is the better starting point for this product.
