const express = require('express');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const connectDB = require('../db/mongoClient');

const router = express.Router();

// Middleware to verify JWT and extract user ID
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Get all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const db = await connectDB();
  const tasks = await db.collection('tasks')
    .find({ userId: req.userId })
    .sort({ 
      'date': 1, 
      'startTime.period': 1, 
      'startTime.hour': 1, 
      'startTime.minute': 1 
    })
    .toArray();
  res.json(tasks);
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = await connectDB();
    const {
      title,
      date,
      startHour,
      startMin,
      startPeriod,
      endHour,
      endMin,
      endPeriod,
      collaborators,
      priority,
      recurring,
      category
    } = req.body;

    const task = {
      title,
      date,
      startTime: {
        hour: startHour,
        minute: startMin,
        period: startPeriod
      },
      endTime: {
        hour: endHour || null,
        minute: endMin || null,
        period: endPeriod || null
      },
      collaborators: collaborators || [],
      priority: priority || '',
      recurring: recurring || false,
      category: category || 'Work',
      userId: req.userId,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await db.collection('tasks').insertOne(task);
    const createdTask = await db.collection('tasks').findOne({ _id: result.insertedId });
    res.status(201).json(createdTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Delete a task by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('tasks').deleteOne({
    _id: new ObjectId(req.params.id),
    userId: req.userId,
  });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Task not found or not authorized' });
  }
  res.json({ message: 'Deleted' });
});

// Update a task's status (e.g., complete/incomplete)
router.patch('/:id', authMiddleware, async (req, res) => {
  const db = await connectDB();
  const { status } = req.body;

  const result = await db.collection('tasks').findOneAndUpdate(
    { _id: new ObjectId(req.params.id), userId: req.userId },
    { $set: { status } },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    return res.status(404).json({ message: 'Task not found or not authorized' });
  }

  res.json(result.value);
});

module.exports = router;
