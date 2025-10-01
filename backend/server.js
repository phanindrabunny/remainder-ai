require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const remindersRoutes = require('./routes/reminders');
const subscriptionRoutes = require('./routes/subscriptions');
const scheduler = require('./scheduler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// VAPID setup for web-push
webpush.setVapidDetails(
  `mailto:${process.env.SMTP_USER}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Connect to Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  // start scheduler AFTER DB connected
  scheduler.start();
}).catch(err => console.error('Mongo connect error', err));

app.use('/api/reminders', remindersRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => res.send('Reminder API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
