const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function initializeDatabase() {
  const db = await open({
    filename: path.resolve(__dirname, 'database.db'),
    driver: sqlite3.Database
  });

  // Créer les tables si elles n'existent pas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  // Remplir avec des données de départ si les tables sont vides
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    // IMPORTANT : Dans une vraie application, vous devriez HASHER les mots de passe.
    const { lastID: userId } = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      'dhouha@gmail.com', 'password123', 'Dhouha Hidouri'
    );
    await db.run('INSERT INTO todos (text, userId) VALUES (?, ?)', 'Learn React', userId);
    await db.run('INSERT INTO todos (text, userId) VALUES (?, ?)', 'Connect to backend', userId);
  }

  return db;
}

// Exporter une promesse qui se résout avec l'instance de la base de données
module.exports = initializeDatabase();

