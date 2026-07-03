import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { QrCode, Lock, Tag, ShieldCheck, Camera } from 'lucide-react';

export default function ClientLogin() {
  const { user, loginClient, events } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [eventId, setEventId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('credentials'); // credentials or qrScan
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState('');

  // Redirect if already logged in as client
  useEffect(() => {
    if (user && user.role === 'client') {
      navigate('/client-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Read URL query parameter for QR login
  useEffect(() => {
    const qrParam = searchParams.get('qr');
    if (qrParam) {
      setEventId(qrParam);
      // Automatically prefill credentials for easy evaluation
      const foundEvt = events.find(e => e.id.toLowerCase() === qrParam.toLowerCase());
      if (foundEvt) {
        setPassword(foundEvt.password);
        setQrSuccessMessage(`QR Code recognized for event: "${foundEvt.name}". Credentials autofilled!`);
      }
    }
  }, [searchParams, events]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await loginClient(eventId, password);
    if (result.success) {
      navigate('/client-dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const simulateQrScan = () => {
    setQrScanning(true);
    setQrSuccessMessage('');
    setError('');
    
    // Simulate a 2.5-second camera scanning animation
    setTimeout(() => {
      setQrScanning(false);
      // Find the first active event (usually Isabella & Alexander)
      const activeEvent = events.find(e => e.status === 'Active') || events[0];
      if (activeEvent) {
        setEventId(activeEvent.id);
        setPassword(activeEvent.password);
        setQrSuccessMessage(`Successfully scanned QR code for event: "${activeEvent.name}". Logging you in...`);
        
        // Auto submit after short delay
        setTimeout(async () => {
          await loginClient(activeEvent.id, activeEvent.password);
          navigate('/client-dashboard', { replace: true });
        }, 1500);
      } else {
        setError('No active event found to scan.');
      }
    }, 2500);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background visual detail */}
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
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="font-logo" style={{
            fontSize: '0.85rem',
            color: 'var(--gold-primary)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Exclusive Access
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#fff' }}>Client Portal</h2>
          <div style={{ width: '40px', height: '1.5px', backgroundColor: 'var(--gold-primary)', margin: '0.75rem auto 0' }}></div>
        </div>

        {/* Auth Mode Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <button 
            onClick={() => setActiveTab('credentials')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'credentials' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'credentials' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              paddingBottom: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Access Credentials
          </button>
          <button 
            onClick={() => setActiveTab('qrScan')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'qrScan' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'qrScan' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              paddingBottom: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Scan QR Code
          </button>
        </div>

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

        {qrSuccessMessage && (
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid var(--gold-primary)',
            color: 'var(--gold-light)',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <span>✨ {qrSuccessMessage}</span>
          </div>
        )}

        {activeTab === 'credentials' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={12} />
                <span>Event ID</span>
              </label>
              <input 
                type="text" 
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="e.g. ROYAL-2026"
                className="form-control"
                required
              />
            </div>



            <div className="form-group" style={{ marginBottom: '2rem' }}>
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

            <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
              <ShieldCheck size={18} />
              <span>Unlock Event Gallery</span>
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {qrScanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '3px solid var(--gold-primary)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--gold-glow-intense)'
                }}>
                  {/* Scan bar animation */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes scanLine {
                      0% { top: 0%; }
                      50% { top: 100%; }
                      100% { top: 0%; }
                    }
                    .scan-bar {
                      position: absolute;
                      left: 0;
                      width: 100%;
                      height: 4px;
                      background: var(--gold-gradient);
                      box-shadow: var(--gold-glow);
                      animation: scanLine 2s infinite linear;
                    }
                  `}} />
                  <div className="scan-bar"></div>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera size={40} color="var(--gold-primary)" style={{ opacity: 0.7 }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: '600' }}>
                  Accessing device camera... Scanning code...
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <QrCode size={96} strokeWidth={1} color="var(--gold-secondary)" />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Hold your printed event invitation QR code in front of your camera, or upload a screenshot to log in instantly.
                </p>
                <button 
                  onClick={simulateQrScan}
                  className="btn btn-gold animate-pulse-gold" 
                  style={{ width: '100%' }}
                >
                  <Camera size={18} />
                  <span>Start Camera Scanner</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
