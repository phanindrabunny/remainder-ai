import React, { useState } from 'react';
import { createReminder } from '../api';
import { subscribeUser } from '../push';

export default function ReminderForm({ onSaved, senderEmail, receiverEmail }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [channels, setChannels] = useState(['browser']);

  const toggleChannel = (ch) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(x => x !== ch) : [...prev, ch]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !dateTime || (!channels.length)) return alert('Please fill required fields');

    const payload = {
      userEmail: receiverEmail,
      senderEmail: senderEmail,
      title,
      details,
      dateTime: new Date(dateTime).toISOString(),
      channels,
      repeat: 'none'
    };

    try {
      await createReminder(payload);
      // if browser push included, request permission and subscribe
      if (channels.includes('browser')) {
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }
        if (Notification.permission === 'granted') {
          await subscribeUser(receiverEmail);
        }
      }
      setTitle(''); setDetails(''); setDateTime('');
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label>Title*</label>
        <input 
          type="text"
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          required 
          placeholder="Enter reminder title"
        />
      </div>
      <div className="form-group">
        <label>Details</label>
        <input 
          type="text"
          value={details} 
          onChange={e=>setDetails(e.target.value)}
          placeholder="Enter reminder details"
        />
      </div>
      <div className="form-group">
        <label>Date & Time*</label>
        <input 
          type="datetime-local" 
          value={dateTime} 
          onChange={e=>setDateTime(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Channels</label>
        <div className="channels-group">
          <div className="channel-option">
            <input 
              type="checkbox" 
              checked={channels.includes('browser')} 
              onChange={()=>toggleChannel('browser')}
            />
            <span>Browser</span>
          </div>
          <div className="channel-option">
            <input 
              type="checkbox" 
              checked={channels.includes('email')} 
              onChange={()=>toggleChannel('email')}
            />
            <span>Email</span>
          </div>
        </div>
      </div>
      <button type="submit">Save Reminder</button>
    </form>
  );
}
