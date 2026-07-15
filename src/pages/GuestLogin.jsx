import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import GoogleSignInModal from '../components/GoogleSignInModal';
import { Info, LogIn } from 'lucide-react';

export default function GuestLogin() {
  const { user, setUser, registerGuest, loginWithGoogleReal, events, addNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const rawUrlEventId = searchParams.get('id') || '';
  const urlEventId = (rawUrlEventId === 'undefined' || rawUrlEventId === 'null') ? '' : rawUrlEventId;
  const [selectedEventId, setSelectedEventId] = useState(urlEventId || (user?.eventId) || '');
  const matchedEvent = events.find(e => e.id.toLowerCase() === selectedEventId.toLowerCase());

  // Redirect if already logged in as a registered guest or client (not anonymous guest)
  useEffect(() => {
    if (user && !user.isGuest && selectedEventId) {
      navigate(`/client-dashboard?id=${selectedEventId}`, { replace: true });
    }
  }, [user, navigate, selectedEventId]);

  const handleGoogleClick = async () => {
    let targetId = selectedEventId;
    if (!targetId) {
      const activeEvent = events.find(e => e.status === 'Active');
      if (activeEvent) {
        targetId = activeEvent.id;
      } else if (events.length > 0) {
        targetId = events[0].id;
      } else {
        targetId = 'EVE01';
      }
    }
    try {
      setError('');
      await loginWithGoogleReal(targetId);
    } catch (err) {
      console.warn("Real Google OAuth failed, falling back to mock chooser modal:", err.message);
      setIsGoogleModalOpen(true);
    }
  };

  const handleGoogleSignInSuccess = async (googleUser) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    let targetId = selectedEventId;
    if (!targetId) {
      const activeEvent = events.find(e => e.status === 'Active');
      if (activeEvent) {
        targetId = activeEvent.id;
      } else if (events.length > 0) {
        targetId = events[0].id;
      } else {
        targetId = 'EVE01';
      }
    }
    
    const matched = events.find(e => e.id.toLowerCase() === targetId.toLowerCase());
    
    try {
      const guestPayload = {
        name: googleUser.name,
        email: googleUser.email,
        eventId: targetId,
        authProvider: 'Google'
      };

      // Save guest details to Supabase database
      await registerGuest(guestPayload);

      // Update session user state to registered guest
      const registeredUser = {
        role: 'client', // Map role to client to let them view client dashboard
        isGuest: false, // Set isGuest to false so they are recognized as signed in
        eventId: targetId,
        eventName: matched?.name || 'Event Gallery',
        clientName: googleUser.name,
        email: googleUser.email
      };

      setUser(registeredUser);
      sessionStorage.setItem('antigravity_current_user', JSON.stringify(registeredUser));

      addNotification("Guest Sign-in", `Welcome to the gallery, ${googleUser.name}!`, "success");
      setSuccess(`Signed in successfully as ${googleUser.name}! Opening gallery...`);

      setTimeout(() => {
        navigate(`/client-dashboard?id=${targetId}`, { replace: true });
      }, 1500);
    } catch (err) {
      setError("Failed to register guest details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6.5rem 1rem 4rem',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '85vh',
      backgroundColor: 'var(--bg-deep)'
    }}>
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        top: '10%',
        left: '10%',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '3.5rem 2.5rem',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="font-logo" style={{
            fontSize: '0.85rem',
            color: 'var(--gold-primary)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Guest Access Portal
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Guest Sign In</h2>
          {matchedEvent && (
            <p style={{ fontSize: '0.9rem', color: 'var(--gold-light)', marginTop: '0.5rem' }}>
              Event: {matchedEvent.name}
            </p>
          )}
          <div style={{ width: '40px', height: '1.5px', backgroundColor: 'var(--gold-primary)', margin: '0.75rem auto 0' }}></div>
        </div>



        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'left'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <span>✨ {success}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0' }}>
          <button 
            type="button" 
            onClick={handleGoogleClick}
            className="btn btn-gold" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem' }}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" style={{ fill: 'currentColor' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.87-2.14 5.3-4.57 6.96l7.13 5.52C43.5 35.8 46.5 30.34 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.52c-1.97 1.35-4.5 2.15-7.76 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'left'
        }}>
          <Info size={14} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Guest sign-in allows you to view the event live sharing media. We'll store your guest access details in the system.
          </span>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      <GoogleSignInModal 
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSignInSuccess}
        eventName={matchedEvent?.name}
      />
    </div>
  );
}
