require('dotenv').config();   // 🔥 MUST BE FIRST LINE

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ DB CONNECTION (from .env)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'voting_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ---------------- TEST ROUTE ----------------
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// ---------------- POSITIONS ----------------
app.get('/api/positions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM positions ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CANDIDATES ----------------
app.get('/api/candidates', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, p.position_name 
      FROM candidates c
      LEFT JOIN positions p ON c.position_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- VOTERS ----------------
app.get('/api/voters', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM voters');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN (FIXED) ----------------
app.post('/api/voters/login', async (req, res) => {
  try {
    const { idOrEmail, password } = req.body;

    if (!idOrEmail || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const [rows] = await db.query(
      'SELECT * FROM voters WHERE (email = ? OR voter_id = ?) AND password = ?',
      [idOrEmail, idOrEmail, password]
    );

    if (rows.length > 0) {
      const voter = rows[0];
      delete voter.password;

      res.json({ success: true, voter });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- REGISTER ----------------
app.post('/api/voters', async (req, res) => {
  try {
    const { name, age, voter_id, email, password } = req.body;

    const [result] = await db.query(
      'INSERT INTO voters (name, age, voter_id, email, password) VALUES (?, ?, ?, ?, ?)',
      [name, age, voter_id, email, password]
    );

    res.json({ message: 'Voter registered', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- VOTES ----------------
app.get('/api/votes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM votes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/votes', async (req, res) => {
  try {
    const { voter_id, candidate_id, position_id } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM votes WHERE voter_id = ? AND position_id = ?',
      [voter_id, position_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already voted' });
    }

    await db.query(
      'INSERT INTO votes (voter_id, candidate_id, position_id) VALUES (?, ?, ?)',
      [voter_id, candidate_id, position_id]
    );

    await db.query(
      'UPDATE candidates SET votes_count = votes_count + 1 WHERE id = ?',
      [candidate_id]
    );

    res.json({ message: 'Vote cast successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ELECTIONS ----------------
app.get('/api/elections', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM elections');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/elections', async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;

    const [result] = await db.query(
      'INSERT INTO elections (title, description, start_date, end_date) VALUES (?, ?, ?, ?)',
      [title, description, start_date, end_date]
    );

    res.json({ message: 'Election added', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});