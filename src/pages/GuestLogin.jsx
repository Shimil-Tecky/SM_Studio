import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Mail, User, Info } from 'lucide-react';

export default function GuestLogin() {
  const { user, setUser, registerGuest, events, addNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const eventId = searchParams.get('id') || (user?.eventId) || '';
  const matchedEvent = events.find(e => e.id.toLowerCase() === eventId.toLowerCase());

  // Redirect if already logged in as a registered guest or client (not anonymous guest)
  useEffect(() => {
    if (user && !user.isGuest) {
      navigate(`/client-dashboard?id=${eventId}`, { replace: true });
    }
  }, [user, navigate, eventId]);

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email address.");
      return;
    }

    setLoading(true);
    setError('');

    // Simulate Google OAuth
    setTimeout(async () => {
      try {
        const guestPayload = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          eventId: eventId,
          authProvider: 'Google'
        };

        // Save guest details to Supabase database
        await registerGuest(guestPayload);

        // Update session user state to registered guest
        const registeredUser = {
          role: 'client', // Map role to client to let them view client dashboard
          isGuest: false, // Set isGuest to false so they are recognized as signed in
          eventId: eventId,
          eventName: matchedEvent?.name || 'Event Gallery',
          clientName: name.trim(),
          email: email.trim().toLowerCase()
        };

        setUser(registeredUser);
        sessionStorage.setItem('antigravity_current_user', JSON.stringify(registeredUser));

        addNotification("Guest Sign-in", `Welcome to the gallery, ${name.trim()}!`, "success");
        setSuccess("Signed in successfully! Opening gallery...");

        setTimeout(() => {
          navigate(`/client-dashboard?id=${eventId}`, { replace: true });
        }, 1500);
      } catch (err) {
        setError("Failed to register guest details. Please try again.");
        setLoading(false);
      }
    }, 1500);
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
        padding: '3rem 2.5rem',
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
          <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Guest Login</h2>
          {matchedEvent && (
            <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginTop: '0.5rem' }}>
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
            gap: '0.5rem'
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
            marginBottom: '1.5rem'
          }}>
            <span>✨ {success}</span>
          </div>
        )}

        <form onSubmit={handleGoogleSignIn}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={12} />
              <span>Full Name</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={12} />
              <span>Gmail Address</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john.doe@gmail.com"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-gold" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" style={{ fill: 'currentColor' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.87-2.14 5.3-4.57 6.96l7.13 5.52C43.5 35.8 46.5 30.34 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.52c-1.97 1.35-4.5 2.15-7.76 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{loading ? "Signing in with Google..." : "Continue with Google"}</span>
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <Info size={14} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
            We'll store your guest login details linked to this event. 
          </span>
        </div>
      </div>
    </div>
  );
}
