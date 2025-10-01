const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  details: { type: String },
  dateTime: { type: Date, required: true }, // store in UTC
  repeat: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  channels: [{ type: String }], // 'browser','email'
  status: { type: String, enum: ['pending','sent'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
