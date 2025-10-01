const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Save subscription
router.post('/', async (req, res) => {
  try {
    const { subscription, userEmail } = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      const s = new Subscription({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userEmail
      });
      await s.save();
      return res.status(201).json(s);
    }
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'save failed' });
  }
});

// list subscriptions (admin)
router.get('/', async (req, res) => {
  const list = await Subscription.find();
  res.json(list);
});

module.exports = router;
