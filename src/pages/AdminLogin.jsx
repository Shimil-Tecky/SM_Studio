import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Shield, Lock, User, KeyRound, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminLogin() {
  const { user, loginAdmin } = useContext(AppContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Super Admin');
  const [error, setError] = useState('');

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && (user.role === 'Super Admin' || user.role === 'Event Admin' || user.role === 'Editor' || user.role === 'Employee')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginAdmin(username, password, role);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message);
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
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 60%)',
        bottom: '5%',
        right: '10%',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '3rem 2.5rem',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'var(--gold-primary)',
            marginBottom: '1rem',
            boxShadow: 'var(--gold-glow)'
          }}>
            <Shield size={24} />
          </div>
          <span className="font-logo" style={{
            fontSize: '0.8rem',
            color: 'var(--gold-primary)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.25rem'
          }}>
            Studio Console
          </span>
          <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Admin Access</h2>
          <div style={{ width: '30px', height: '1.5px', backgroundColor: 'var(--gold-primary)', margin: '0.75rem auto 0' }}></div>
        </div>

        {!supabase && (
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'var(--gold-primary)',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            lineHeight: '1.4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <span>⚠️</span>
              <span>Offline Sandbox Mode</span>
            </div>
            <span>Your Vercel environment variables are not configured. The app is falling back to the local database. To use Supabase, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Settings.</span>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={12} />
              <span>Username</span>
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={12} />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <KeyRound size={12} />
              <span>System Role</span>
            </label>
            <select 
              className="form-control form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Super Admin">Super Admin (Global Authority)</option>
              <option value="Event Admin">Event Admin (Manager)</option>
              <option value="Editor">Editor (Color & Uploads)</option>
              <option value="Employee">Employee (Photographer/Videographer)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
            <span>Sign In to System</span>
            <ChevronRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
