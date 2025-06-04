const express = require('express');
const connectDB = require('../db/mongoClient');

const router = express.Router();

// GET /api/users - returns all users with their email
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db
      .collection('users')
      .find({}, { projection: { email: 1 } }) // only return email, not password
      .toArray();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
