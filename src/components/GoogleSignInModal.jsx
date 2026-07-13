import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';

export default function GoogleSignInModal({ isOpen, onClose, onSuccess, eventName }) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(null);

  if (!isOpen) return null;

  // Preset realistic Google Accounts
  const simulatedAccounts = [
    { name: 'Shimil Manoj', email: 'shimi.manoj@gmail.com', avatar: 'S' },
    { name: 'Guest User', email: 'guest.antigravity@gmail.com', avatar: 'G' }
  ];

  const handleSelectAccount = (account) => {
    setLoading(true);
    setLoadingAccount(account.email);
    setError('');

    // Simulate Google Authentication delay
    setTimeout(() => {
      onSuccess({
        name: account.name,
        email: account.email
      });
      setLoading(false);
      setLoadingAccount(null);
      onClose();
    }, 1200);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    if (!customEmail.includes('@') || !customEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      onSuccess({
        name: customName.trim(),
        email: customEmail.trim().toLowerCase()
      });
      setLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      {/* Google Card Container */}
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: '#ffffff', // Standard Google White Theme for authentic look
        borderRadius: '8px',
        border: '1px solid #dadce0',
        padding: '2.5rem 2.2rem 1.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#202124',
        position: 'relative',
        animation: 'googleModalEnter 0.25s ease-out'
      }}>
        {/* Style injection for Google elements */}
        <style>{`
          @keyframes googleModalEnter {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .google-account-row {
            display: flex;
            align-items: center;
            padding: 0.8rem 0.5rem;
            border-bottom: 1px solid #e8eaed;
            cursor: pointer;
            transition: background-color 0.15s;
            border-radius: 4px;
          }
          .google-account-row:hover {
            background-color: #f8f9fa;
          }
          .google-input {
            width: 100%;
            padding: 0.75rem 0.8rem;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 0.9rem;
            color: #202124;
            outline: none;
            transition: border-color 0.2s;
          }
          .google-input:focus {
            border-color: #1a73e8;
            box-shadow: 0 0 0 1px #1a73e8;
          }
          .google-btn-blue {
            background-color: #1a73e8;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            padding: 0.6rem 1.5rem;
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .google-btn-blue:hover {
            background-color: #1557b0;
          }
          .google-btn-flat {
            background: none;
            border: none;
            color: #1a73e8;
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
          }
          .google-btn-flat:hover {
            background-color: rgba(26, 115, 232, 0.04);
          }
          .google-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #e8eaed;
            border-top-color: #1a73e8;
            border-radius: 50%;
            animation: googleSpin 0.8s linear infinite;
          }
          @keyframes googleSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Close Button */}
        <button 
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5f6368',
            padding: '4px',
            borderRadius: '50%'
          }}
        >
          <X size={18} />
        </button>

        {/* Google Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.87-2.14 5.3-4.57 6.96l7.13 5.52C43.5 35.8 46.5 30.34 46.5 24z"/>
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.52c-1.97 1.35-4.5 2.15-7.76 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '400', margin: '0 0 0.4rem', color: '#202124' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#5f6368', margin: 0 }}>
            to continue to {eventName || 'SM Studio'}
          </p>
        </div>

        {error && (
          <div style={{
            color: '#d93025',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            backgroundColor: '#fce8e6',
            padding: '0.6rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #fdadb0'
          }}>
            {error}
          </div>
        )}

        {/* Loading overlay for entire dialog when custom logging in */}
        {loading && !loadingAccount && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
            gap: '1rem'
          }}>
            <div className="google-spinner" style={{ width: '32px', height: '32px' }} />
            <span style={{ fontSize: '0.85rem', color: '#5f6368' }}>Connecting Google Account...</span>
          </div>
        )}

        {(!loading || loadingAccount) && (
          <>
            {!showAddAccount ? (
              <div>
                {/* Account List */}
                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
                  {simulatedAccounts.map((acc, index) => (
                    <div 
                      key={index} 
                      className="google-account-row"
                      onClick={() => !loading && handleSelectAccount(acc)}
                      style={{ opacity: loading && loadingAccount !== acc.email ? 0.5 : 1 }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#1a73e8',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        marginRight: '0.85rem'
                      }}>
                        {acc.avatar}
                      </div>
                      
                      {/* Details */}
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#3c4043' }}>{acc.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#5f6368' }}>{acc.email}</div>
                      </div>

                      {/* Loading status per account */}
                      {loadingAccount === acc.email && (
                        <div className="google-spinner" />
                      )}
                    </div>
                  ))}

                  {/* Use another account row */}
                  <div 
                    className="google-account-row"
                    onClick={() => setShowAddAccount(true)}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f3f4',
                      color: '#5f6368',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.85rem'
                    }}>
                      <UserPlus size={16} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', fontSize: '0.85rem', fontWeight: '500', color: '#1a73e8' }}>
                      Use another account
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#5f6368', lineHeight: '1.4', marginTop: '1.5rem' }}>
                  To continue, Google will share your name, email address, language preference, and profile picture with SM Studio.
                </div>
              </div>
            ) : (
              /* Custom Account Input Form */
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#5f6368' }}>Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="google-input"
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#5f6368' }}>Google Email</label>
                  <input 
                    type="email" 
                    placeholder="yourname@gmail.com" 
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="google-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddAccount(false)}
                    className="google-btn-flat"
                  >
                    Back to list
                  </button>
                  <button 
                    type="submit" 
                    className="google-btn-blue"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Google Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2.5rem',
          paddingTop: '0.8rem',
          borderTop: '1px solid #e8eaed',
          fontSize: '0.7rem',
          color: '#70757a'
        }}>
          <div>English (United States)</div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <span style={{ cursor: 'pointer' }}>Help</span>
            <span style={{ cursor: 'pointer' }}>Privacy</span>
            <span style={{ cursor: 'pointer' }}>Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
