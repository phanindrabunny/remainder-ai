const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  keys: { type: Object, required: true },
  userEmail: { type: String }, // optional association
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
