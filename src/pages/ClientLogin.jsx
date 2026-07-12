import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { QrCode, Lock, Tag, ShieldCheck, Camera } from 'lucide-react';

export default function ClientLogin() {
  const { user, setUser, loginClient, loginClientViaQr, registerGuest, events, addNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [eventId, setEventId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('credentials'); // credentials or qrScan
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState('');
  
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);

  const handleGoogleSignIn = () => {
    const emailInput = window.prompt("Enter your Google Account email to authenticate:", "client@example.com");
    if (emailInput === null) return; // User cancelled

    const cleanEmail = emailInput.trim().toLowerCase();
    setError('');

    if (addNotification) {
      addNotification("Google Auth", `Authenticating ${cleanEmail}...`, "info");
    }

    // Simulate Google Account checking against registered clients
    setTimeout(async () => {
      const matchedEvent = events.find(e => e.email && e.email.toLowerCase() === cleanEmail);

      if (matchedEvent) {
        const clientUser = {
          role: 'client',
          isGuest: false,
          eventId: matchedEvent.id,
          eventName: matchedEvent.name,
          clientName: matchedEvent.clientName,
          email: matchedEvent.email
        };
        if (setUser) setUser(clientUser);
        if (addNotification) {
          addNotification("Access Granted", `Successfully authenticated via Google for event "${matchedEvent.name}"`, "success");
        }
        navigate('/client-dashboard', { replace: true });
      } else {
        setError('Access Denied: This Google Account is not registered as a client for any event. Guests cannot sign in with Google.');
        if (addNotification) {
          addNotification("Access Denied", "Google Account not registered.", "error");
        }
      }
    }, 1500);
  };

  // Redirect if already logged in as client
  useEffect(() => {
    if (user && user.role === 'client') {
      navigate('/client-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Read URL query parameter for QR login (Bypasses password directly)
  useEffect(() => {
    const qrParam = searchParams.get('qr');
    if (qrParam) {
      setEventId(qrParam);
      async function autoLogin() {
        const result = await loginClientViaQr(qrParam);
        if (result.success) {
          setQrSuccessMessage(`QR Code recognized! Redirecting directly to the gallery...`);
          setTimeout(() => {
            navigate(`/client-dashboard?id=${qrParam}`, { replace: true });
          }, 1000);
        } else {
          setError(result.message || 'QR Login failed.');
        }
      }
      autoLogin();
    }
  }, [searchParams, loginClientViaQr, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const cleanId = (eventId || '').trim();
    const cleanPassword = (password || '').trim();
    
    const result = await loginClient(cleanId, cleanPassword);
    if (result.success) {
      navigate('/client-dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const startCamera = async () => {
    setQrScanning(true);
    setQrSuccessMessage('');
    setError('');
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Camera request timeout")), 3000)
      );

      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }),
        timeoutPromise
      ]);
      setCameraStream(stream);
      
      // Delay slightly to ensure ref is bound
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
      
      // Simulate code detection after 3.5 seconds of showing the live feed
      setTimeout(async () => {
        // Stop camera tracks
        stream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        setQrScanning(false);
        
        // Match an active event or default
        const activeEvent = events.find(e => e.status === 'Active') || events[0];
        if (activeEvent) {
          setEventId(activeEvent.id);
          setQrSuccessMessage(`Successfully scanned QR code for event: "${activeEvent.name}". Opening gallery...`);
          
          setTimeout(async () => {
            await loginClientViaQr(activeEvent.id);
            navigate(`/client-dashboard?id=${activeEvent.id}`, { replace: true });
          }, 1500);
        } else {
          setError('No active event found to scan.');
        }
      }, 4000);
      
    } catch (err) {
      console.error("Camera access failed, falling back to mock animation:", err);
      // Fallback if permission denied or no camera (e.g. desktop sandbox)
      setTimeout(() => {
        setQrScanning(false);
        const activeEvent = events.find(e => e.status === 'Active') || events[0];
        if (activeEvent) {
          setEventId(activeEvent.id);
          setQrSuccessMessage(`[Simulated] QR Code recognized for event: "${activeEvent.name}".`);
          setTimeout(async () => {
            await loginClientViaQr(activeEvent.id);
            navigate(`/client-dashboard?id=${activeEvent.id}`, { replace: true });
          }, 1500);
        } else {
          setError('No active event found to scan.');
        }
      }, 3000);
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
          <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Client Portal</h2>
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

            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0 1rem', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              className="btn btn-outline" 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                textTransform: 'none',
                letterSpacing: 'normal',
                fontSize: '0.85rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.87-2.14 5.3-4.57 6.96l7.13 5.52C43.5 35.8 46.5 30.34 46.5 24z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.52c-1.97 1.35-4.5 2.15-7.76 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Continue with Google</span>
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
                  boxShadow: 'var(--gold-glow-intense)',
                  backgroundColor: '#000'
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
                      z-index: 10;
                    }
                  `}} />
                  <div className="scan-bar"></div>
                  
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 2
                    }}
                  />
                  
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(212, 175, 55, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1
                  }}>
                    <Camera size={40} color="var(--gold-primary)" style={{ opacity: 0.4 }} />
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
                  onClick={startCamera}
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
