const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Create reminder
router.post('/', async (req, res) => {
  try {
    const r = new Reminder(req.body);
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get all reminders (optionally filter by email)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.email) filter.userEmail = req.query.email;
  const reminders = await Reminder.find(filter).sort({ dateTime: 1 });
  res.json(reminders);
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
