import React, { useEffect, useState, useCallback } from 'react';
import { getReminders } from '../api';

export default function ReminderList({ userEmail }) {
  const [list, setList] = useState([]);

  // useCallback ensures the function reference is stable for useEffect
  const fetchReminders = useCallback(async () => {
    try {
      const res = await getReminders(userEmail);
      setList(res);
    } catch (err) {
      console.error(err);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return (
    <div className="reminders-section">
      <div className="reminders-header">
        <h3>Reminders</h3>
        <button className="refresh-button" onClick={fetchReminders}>Refresh</button>
      </div>
      <ul className="reminders-list">
        {list.map(r => (
          <li key={r._id} className="reminder-item">
            <span className="reminder-title">{r.title}</span>
            <span className="reminder-datetime">{new Date(r.dateTime).toLocaleString()}</span>
            <div className="reminder-channels">
              Channels: {r.channels.join(', ')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
