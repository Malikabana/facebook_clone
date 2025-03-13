const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '01122001',
  database: 'facebook_backend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Secret Key for JWT
const JWT_SECRET = 'your_secret_key'; 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Missing token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

// Register Endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`); // Log hashed password for debugging
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    console.log(`Stored Hashed Password: ${user.password}`); // Log stored hashed password for debugging
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get User by ID (Protected Endpoint)
app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Posts (Query Parameters)
app.get('/posts', async (req, res) => {
  try {
    const { userId, limit = 10, offset = 0 } = req.query;
    let query = 'SELECT * FROM posts';
    let params = [];
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Post (Protected, User-Specific)
app.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    const [result] = await pool.execute(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [req.user.id, content]
    );
    res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Post (Protected, User-Specific)
app.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    const [rows] = await pool.execute(
      'SELECT * FROM posts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found or unauthorized' });
    await pool.execute('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [content, req.params.id]);
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Add this after pool creation in server.js
pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL successfully');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL Connection Error:', err);
  });
