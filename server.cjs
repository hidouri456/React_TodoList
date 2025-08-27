const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dbPromise = require('./database.cjs');
const authMiddleware = require('./auth.cjs');

const app = express();
const PORT = 3001; 
const JWT_SECRET = 'your-super-secret-and-long-key-that-is-hard-to-guess';

app.use(cors());
app.use(bodyParser.json());


app.post('/api/auth/login', (req, res) => {
  (async () => {
    const db = await dbPromise;
    const { email, password } = req.body;
    // IMPORTANT : La comparaison de mot de passe en texte clair est dangereuse. Utilisez un hachage.
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', email, password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const userPayload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: userPayload });
  })().catch(err => res.status(500).json({ message: err.message }));
});


app.get('/api/user/profile', authMiddleware, (req, res) => {
    
    const { password, ...userPayload } = req.user;
    res.json(userPayload);
});



app.get('/api/todos', authMiddleware, async (req, res) => {
  try {
    const db = await dbPromise;
    const userTodos = await db.all('SELECT * FROM todos WHERE userId = ?', req.user.id);
    res.json(userTodos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/api/todos', authMiddleware, async (req, res) => {
  try {
    const db = await dbPromise;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }
    const result = await db.run('INSERT INTO todos (text, userId) VALUES (?, ?)', text, req.user.id);
    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', result.lastID);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const db = await dbPromise;
    const { text } = req.body;
    const todoId = parseInt(req.params.id, 10);

    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }

    const result = await db.run('UPDATE todos SET text = ? WHERE id = ? AND userId = ?', text, todoId, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }
    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', todoId);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const db = await dbPromise;
    const todoId = parseInt(req.params.id, 10);
    const result = await db.run('DELETE FROM todos WHERE id = ? AND userId = ?', todoId, req.user.id);
    if (result.changes === 0) {
        return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT} - server.cjs:107`);
});