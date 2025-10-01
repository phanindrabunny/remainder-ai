const webpush = require('web-push');
const Subscription = require('../models/Subscription');
const { sendEmail } = require('../utils/email');

async function sendNotificationsForReminder(reminder) {
  const message = `${reminder.title}${reminder.details ? ' - ' + reminder.details : ''}`;

  // Email
  if (reminder.channels.includes('email') && reminder.userEmail) {
    try {
      await sendEmail(reminder.userEmail, `Reminder: ${reminder.title}`, message);
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  // Browser Push
  if (reminder.channels.includes('browser')) {
    const subs = await Subscription.find(reminder.userEmail ? { userEmail: reminder.userEmail } : {});
    for (const s of subs) {
      try {
        await webpush.sendNotification({
          endpoint: s.endpoint,
          keys: s.keys
        }, JSON.stringify({ title: reminder.title, body: reminder.details || '' }));
      } catch (err) {
        console.error('Push failed for', s.endpoint, err);
      }
    }
  }
}

module.exports = { sendNotificationsForReminder };
