const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../db/mongoClient');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      email: normalizedEmail,
      password: hashed,
    });

    res.status(201).json({ message: 'Signup successful', user: { email: normalizedEmail, id: result.insertedId } });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Account not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ token, username: user.email });
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
