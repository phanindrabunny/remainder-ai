import React, { useState, useEffect } from 'react';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';
import EmailAuth from './components/EmailAuth';
import './styles/index.css';
import './styles/additional.css';
import './styles/header.css';
import './styles/google-auth.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('senderEmail');
    if (storedEmail) {
      setSenderEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthComplete = (data) => {
    setIsAuthenticated(true);
    setSenderEmail(data.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('senderEmail');
    setIsAuthenticated(false);
    setSenderEmail('');
  };

  if (!isAuthenticated) {
    return <EmailAuth onAuthComplete={handleAuthComplete} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Reminder App</h1>
        <div className="user-info">
          <span>Sending from: {senderEmail}</span>
          <button className="logout-button" onClick={handleLogout}>
            Change Email
          </button>
        </div>
      </div>
      
      <div className="email-section">
        <label>Receiver's Email:</label>
        <input 
          type="email"
          value={receiverEmail} 
          onChange={e => setReceiverEmail(e.target.value)}
          placeholder="Enter recipient's email"
          className="email-input"
        />
      </div>
      
      <ReminderForm 
        onSaved={() => window.location.reload()} 
        senderEmail={senderEmail}
        receiverEmail={receiverEmail}
      />
      <ReminderList userEmail={receiverEmail} />
    </div>
  );
}

export default App;
