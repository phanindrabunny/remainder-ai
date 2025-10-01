import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; 


export default function EmailAuth({ onAuthComplete }) {
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const email = decodedToken.email;
      
      // Verify it's a Gmail account
      if (!email.endsWith('@gmail.com')) {
        setError('Please use a Gmail account for authentication.');
        return;
      }

      // Store the email and credentials
      localStorage.setItem('senderEmail', email);
      localStorage.setItem('googleCredential', credentialResponse.credential);
      
      onAuthComplete({ email });
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Failed to authenticate with Google. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in with Google</h2>
        <p className="auth-description">
          To enable email notifications, please sign in with your Gmail account.
          This will allow us to send reminder emails on your behalf.
        </p>
        {error && <div className="error-message">{error}</div>}
        
        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="pill"
            theme="filled_blue"
            text="signin_with"
            useOneTap={true}
          />
        </div>
        
        <div className="auth-info">
          <p className="help-text">
            We only use your Gmail account to send reminder notifications.
            Your credentials are securely stored and can be revoked at any time.
          </p>
        </div>
      </div>
    </div>
  );
}