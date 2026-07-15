import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Camera, LogOut, LogIn, User, Shield, Menu, X, Globe, ArrowLeft, Send, Check } from 'lucide-react';

export default function Navbar() {
  const { user, logout, theme, setTheme, events, clientRequests, submitClientRequest, addNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (user?.isGuest) {
      const eventIdParam = user?.eventId || '';
      navigate(`/guest-login?id=${eventIdParam}`);
      setMobileMenuOpen(false);
    } else {
      handleLogout();
    }
  };

  const isClientApproved = user && events && events.some(e => e.email && e.email.toLowerCase() === user.email.toLowerCase());

  const myRequests = (clientRequests || []).filter(r => r.guest_email && r.guest_email.toLowerCase() === user?.email?.toLowerCase());

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setSubmittingRequest(true);
    const payload = {
      guest_name: user.clientName || user.username || 'Google Guest',
      guest_email: user.email,
      event_id: selectedEventId,
      message: requestMessage,
      status: 'pending'
    };
    const res = await submitClientRequest(payload);
    setSubmittingRequest(false);
    if (res.success) {
      addNotification("Request Sent", "Your request to access the event as client has been sent to admins.", "success");
      setRequestMessage('');
      setSelectedEventId('');
    } else {
      addNotification("Request Failed", res.message || "Failed to submit request", "error");
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-gold' : 'text-secondary';
  };

  const getBubbleStyle = (path) => {
    const active = location.pathname === path;
    return {
      fontSize: '0.85rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: active ? 'rgba(212, 175, 55, 0.08)' : 'var(--nav-bg)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: active ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid var(--nav-border)',
      borderRadius: '50px',
      padding: '0.55rem 1.3rem',
      color: active ? 'var(--gold-primary)' : 'var(--text-secondary)',
      boxShadow: active ? '0 4px 15px rgba(212, 175, 55, 0.15)' : 'var(--nav-shadow)',
      transition: 'var(--transition-smooth)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer'
    };
  };



  const isGalleryPage = location.pathname === '/client-dashboard';
  const showBackButton = location.pathname !== '/' && !isGalleryPage;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      transition: 'var(--transition-smooth)',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }} className="main-navbar">
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, overflow: 'hidden' }}>
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid var(--nav-border)',
              borderRadius: '50px',
              padding: '0.55rem 1.3rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: 'var(--nav-shadow)',
              borderStyle: 'solid',
              outline: 'none'
            }}
            className="nav-bubble"
          >
            <ArrowLeft size={16} color="var(--gold-primary)" />
            <span>Back</span>
          </button>
        )}

        {/* Brand Logo */}
        <Link to="/" className="nav-bubble nav-logo-link" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--nav-border)',
          borderRadius: '50px',
          padding: '0.5rem 1.25rem',
          boxShadow: 'var(--nav-shadow)',
          transition: 'var(--transition-smooth)',
          textDecoration: 'none',
          overflow: 'hidden',
          maxWidth: '100%'
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            background: 'var(--gold-gradient)',
            padding: '0.4rem',
            borderRadius: '25%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--gold-glow)',
            flexShrink: 0
          }}>
            <Camera size={20} color="#050505" strokeWidth={2.5} />
          </div>
          <span className="font-logo nav-logo-text" style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Antigravity Studio Live
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
      {/* Inline responsive CSS — injected once */}
      <style dangerouslySetInnerHTML={{__html: `
        .nav-bubble:hover {
          background: var(--nav-hover-bg) !important;
          border-color: var(--nav-hover-border) !important;
          color: var(--text-primary) !important;
          box-shadow: var(--nav-hover-shadow) !important;
          transform: translateY(-1px);
        }
        .nav-bubble-gold:hover {
          box-shadow: var(--gold-glow-intense) !important;
          transform: translateY(-1px);
          opacity: 0.95;
        }
        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.3) !important;
          border-color: rgba(220, 38, 38, 0.8) !important;
          color: #fff !important;
        }
        /* Mobile ≤ 850px */
        @media (max-width: 850px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
          .nav-logo-text { display: none !important; }
          .nav-logo-link { padding: 0.4rem 0.6rem !important; gap: 0 !important; }
          .nav-left { flex-shrink: 1; min-width: 0; overflow: hidden; }
          .main-navbar { padding: 0.85rem 1rem !important; }
        }
        /* Desktop > 850px */
        @media (min-width: 851px) {
          .mobile-nav-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}} />
        {isGalleryPage ? (
          <button 
            onClick={handleLogout}
            style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#ef4444',
              borderRadius: '50px',
              padding: '0.55rem 1.3rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.15)',
              outline: 'none'
            }}
            className="nav-bubble logout-btn"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>
        ) : (
          <Link to="/" style={getBubbleStyle('/')} className="nav-bubble">Home</Link>
        )}
        {!isGalleryPage && (
          <>
            <Link to="/portfolio" style={getBubbleStyle('/portfolio')} className="nav-bubble">Portfolio</Link>
            <Link to="/events" style={getBubbleStyle('/events')} className="nav-bubble">Events</Link>
            
            {user ? (
              <>
                {isClientApproved && (
                  <Link to="/client-dashboard" style={getBubbleStyle('/client-dashboard')} className="nav-bubble">Client Portal</Link>
                )}
                
                {user.role === 'client' ? (
                  <button 
                    onClick={() => setProfileSidebarOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      outline: 'none',
                      marginLeft: '0.5rem'
                    }}
                  >
                    <img 
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                      alt={user.clientName || user.username}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid var(--gold-primary)',
                        boxShadow: 'var(--gold-glow)'
                      }}
                    />
                  </button>
                ) : (
                  <div style={{
                    background: 'var(--nav-bg)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid var(--nav-border)',
                    borderRadius: '50px',
                    padding: '0.4rem 1.25rem',
                    boxShadow: 'var(--nav-shadow)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginLeft: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {user.username}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {user.role}
                      </span>
                    </div>
                    <button onClick={handleLogout} style={{
                      background: 'rgba(220, 38, 38, 0.15)',
                      border: '1px solid rgba(220, 38, 38, 0.4)',
                      color: '#ef4444',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.75rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'var(--transition-smooth)'
                    }} className="logout-btn">
                      <LogOut size={12} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/guest-login" className="nav-bubble-gold" style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'var(--gold-gradient)',
                  border: '1px solid var(--gold-primary)',
                  borderRadius: '50px',
                  padding: '0.55rem 1.3rem',
                  color: 'var(--bg-deep)',
                  boxShadow: 'var(--gold-glow)',
                  transition: 'var(--transition-smooth)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  <LogIn size={14} />
                  <span>Guest Login</span>
                </Link>
              </div>
            )}

            {/* Mini Light Mode Toggle (On/Off Switch) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
              <span style={{ fontSize: '0.75rem', opacity: theme === 'light' ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>🌙</span>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '50px',
                  backgroundColor: theme === 'light' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.12)',
                  border: '1px solid var(--nav-border)',
                  position: 'relative',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: 0,
                  transition: 'background-color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: theme === 'light' ? '#000' : 'var(--gold-primary)',
                  position: 'absolute',
                  top: '2px',
                  left: theme === 'light' ? '20px' : '2px',
                  transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }} />
              </button>
              <span style={{ fontSize: '0.75rem', opacity: theme === 'light' ? 1 : 0.4, transition: 'opacity 0.3s ease' }}>☀️</span>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle — always rendered, shown via CSS at ≤850px */}
      {!isGalleryPage && (
        <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--gold-primary)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          minWidth: '42px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-primary)',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(212,175,55,0.25)',
          transition: 'var(--transition-smooth)',
          padding: 0,
          flexShrink: 0
        }}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* For gallery page on mobile, show the Exit button directly in place of the toggle */}
      {isGalleryPage && (
        <div className="mobile-only-exit" style={{ display: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 850px) {
              .mobile-only-exit { display: flex !important; }
            }
          `}} />
          <button 
            onClick={handleLogout}
            style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#ef4444',
              borderRadius: '50px',
              padding: '0.55rem 1.3rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.15)',
              outline: 'none'
            }}
            className="nav-bubble logout-btn"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--mobile-menu-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 99
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-border)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--nav-shadow)',
            textDecoration: 'none'
          }}>Home</Link>
          <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-border)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--nav-shadow)',
            textDecoration: 'none'
          }}>Portfolio</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-border)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--nav-shadow)',
            textDecoration: 'none'
          }}>Events</Link>
          

          {user ? (
            <>
              {isClientApproved && (
                <Link to="/client-dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  background: 'var(--nav-bg)',
                  border: '1px solid var(--nav-border)',
                  borderRadius: '50px',
                  padding: '0.6rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: 'var(--nav-shadow)',
                  textDecoration: 'none'
                }}>Client Portal</Link>
              )}
              {/* Admin Dashboard link removed to prevent exposing admin panel on public page viewports */}
              
              {user.role === 'client' ? (
                <button 
                  onClick={() => { setMobileMenuOpen(false); setProfileSidebarOpen(true); }}
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    background: 'var(--gold-gradient)',
                    border: '1px solid var(--gold-primary)',
                    color: 'var(--bg-deep)',
                    borderRadius: '50px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: 'var(--gold-glow)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    outline: 'none'
                  }}
                >
                  <User size={16} />
                  <span>My Account</span>
                </button>
              ) : (
                <div style={{
                  background: 'var(--nav-bg)',
                  border: '1px solid var(--nav-border)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--nav-shadow)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {user.username}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {user.role}
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', borderRadius: '50px', fontSize: '0.8rem', padding: '0.5rem' }}>
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <Link to="/guest-login" onClick={() => setMobileMenuOpen(false)} className="nav-bubble-gold" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: 'var(--gold-gradient)',
                border: '1px solid var(--gold-primary)',
                borderRadius: '50px',
                padding: '0.6rem 1.5rem',
                color: 'var(--bg-deep)',
                boxShadow: 'var(--gold-glow)',
                textDecoration: 'none'
              }}>
                <LogIn size={16} />
                <span>Guest Login</span>
              </Link>
            </div>
          )}
          
          {/* Mobile Theme Toggle switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '1rem',
            padding: '0.5rem 1.25rem',
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-border)',
            borderRadius: '50px',
            width: 'fit-content',
            alignSelf: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', opacity: theme === 'light' ? 0.4 : 1 }}>🌙</span>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '50px',
                backgroundColor: theme === 'light' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.12)',
                border: '1px solid var(--nav-border)',
                position: 'relative',
                cursor: 'pointer',
                outline: 'none',
                padding: 0,
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: theme === 'light' ? '#000' : 'var(--gold-primary)',
                position: 'absolute',
                top: '2px',
                left: theme === 'light' ? '20px' : '2px',
                transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
              }} />
            </button>
            <span style={{ fontSize: '0.85rem', opacity: theme === 'light' ? 1 : 0.4 }}>☀️</span>
          </div>
        </div>
      )}

      {/* Profile Sidebar Backdrop */}
      {profileSidebarOpen && (
        <div 
          onClick={() => setProfileSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Profile Sidebar Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: profileSidebarOpen ? 0 : '-420px',
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary)',
          padding: '2rem 1.5rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>My Account</h3>
          <button 
            onClick={() => setProfileSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
            alt={user?.clientName || user?.username} 
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--gold-primary)',
              marginBottom: '1rem',
              boxShadow: 'var(--gold-glow)'
            }}
          />
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
            {user?.role === 'client' ? user.clientName : user?.username}
          </h4>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {user?.email}
          </p>
          <span style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backgroundColor: isClientApproved ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.08)',
            color: isClientApproved ? 'var(--gold-primary)' : 'var(--text-secondary)',
            border: isClientApproved ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontWeight: '600'
          }}>
            {user?.role === 'client' ? (isClientApproved ? 'Approved Client' : 'Event Guest') : user?.role}
          </span>
        </div>

        {/* Scrollable Request / Info Area */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Request Client Access Form (Only if not already an approved client) */}
          {!isClientApproved && user?.role === 'client' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.25rem',
              backgroundColor: 'rgba(212, 175, 55, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '16px'
            }}>
              <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--gold-light)' }}>
                Request Client Portal Access
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                If you are the groom, bride, or event owner, select your wedding below to request full client portal permissions.
              </p>
              
              <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Select Your Wedding</label>
                  <select 
                    required
                    value={selectedEventId}
                    onChange={e => setSelectedEventId(e.target.value)}
                    style={{
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Choose Wedding --</option>
                    {(events || []).map(evt => (
                      <option key={evt.id} value={evt.id}>{evt.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Message to Admins</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Requesting client dashboard access as the Groom."
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    style={{
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingRequest}
                  style={{
                    backgroundColor: 'var(--gold-primary)',
                    color: 'var(--bg-deep)',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    boxShadow: 'var(--gold-glow)'
                  }}
                >
                  {submittingRequest ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          )}

          {/* Access Requests History */}
          {myRequests.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Access Requests Status
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {myRequests.map(req => {
                  const evt = events.find(e => e.id === req.event_id);
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';
                  const statusColor = isApproved ? '#22c55e' : isRejected ? '#ef4444' : '#eab308';
                  
                  return (
                    <div 
                      key={req.id} 
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{evt?.name || req.event_id}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: `${statusColor}1A`,
                        border: `1px solid ${statusColor}4D`,
                        color: statusColor
                      }}>
                        {req.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Account Switching Option */}
          <button 
            type="button"
            onClick={() => {
              setProfileSidebarOpen(false);
              logout();
              navigate('/guest-login');
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-primary)',
              borderRadius: '50px',
              padding: '0.65rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <span>Switch Account</span>
          </button>
          
          {/* Logout */}
          <button 
            type="button"
            onClick={() => {
              setProfileSidebarOpen(false);
              handleLogout();
            }}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              borderRadius: '50px',
              padding: '0.65rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
