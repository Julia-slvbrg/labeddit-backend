-- Active: 1693689400596@@127.0.0.1@3306
CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    user_role VARCHAR(6) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id)
    REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);