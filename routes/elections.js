const express = require('express');
const router = express.Router();
const db = require('../db');

// GET elections
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM elections');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD election
router.post('/', async (req, res) => {
  const { title, description, start_date, end_date } = req.body;

  try {
    await db.query(
      'INSERT INTO elections (title, description, start_date, end_date) VALUES (?, ?, ?, ?)',
      [title, description, start_date, end_date]
    );

    res.json({ message: 'Election added' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;