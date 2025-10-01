const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const { sendNotificationsForReminder } = require('./controllers/notifyController');

const job = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // find reminders that are pending and due (allowing up to current minute)
    const due = await Reminder.find({ status: 'pending', dateTime: { $lte: now } });

    for (const r of due) {
      console.log('Sending reminder:', r._id, r.title);
      await sendNotificationsForReminder(r);

      // update status and handle repeats
      if (r.repeat === 'none') {
        r.status = 'sent';
      } else {
        // compute next occurrence (very simplistic)
        const next = new Date(r.dateTime);
        if (r.repeat === 'daily') next.setDate(next.getDate() + 1);
        else if (r.repeat === 'weekly') next.setDate(next.getDate() + 7);
        else if (r.repeat === 'monthly') next.setMonth(next.getMonth() + 1);
        r.dateTime = next;
      }
      await r.save();
    }
  } catch (err) {
    console.error('Scheduler error', err);
  }
}, { scheduled: false });

module.exports = { start: () => job.start() };
