import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Camera, LogOut, LogIn, User, Shield, Menu, X, Globe, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const { user, logout, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Link to="/" style={getBubbleStyle('/')} className="nav-bubble">Home</Link>
        {!isGalleryPage && (
          <>
            <Link to="/portfolio" style={getBubbleStyle('/portfolio')} className="nav-bubble">Portfolio</Link>
            <Link to="/events" style={getBubbleStyle('/events')} className="nav-bubble">Events</Link>
            
            {user ? (
              <>
                {user.role === 'client' ? (
                  <Link to="/client-dashboard" style={getBubbleStyle('/client-dashboard')} className="nav-bubble">{user.isGuest ? 'Event Gallery' : 'Client Portal'}</Link>
                ) : (
                  <Link to="/admin" style={getBubbleStyle('/admin')} className="nav-bubble">Admin Dashboard</Link>
                )}
                
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
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {(!user.isGuest || user.role !== 'client') && (
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {user.role === 'client' ? user.clientName : user.username}
                      </span>
                    )}
                    <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {user.role === 'client' ? (user.isGuest ? 'guest' : 'client') : user.role}
                    </span>
                  </div>
                  <button onClick={handleAuthClick} style={{
                    background: user.isGuest ? 'rgba(212, 175, 55, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                    border: user.isGuest ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(220, 38, 38, 0.4)',
                    color: user.isGuest ? 'var(--gold-primary)' : '#ef4444',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'var(--transition-smooth)'
                  }} className={user.isGuest ? "signin-btn" : "logout-btn"}>
                    {user.isGuest ? <LogIn size={12} /> : <LogOut size={12} />}
                    <span>{user.isGuest ? 'Sign In' : 'Logout'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/client-login" className="nav-bubble" style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'var(--nav-bg)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid var(--nav-border)',
                  borderRadius: '50px',
                  padding: '0.55rem 1.3rem',
                  color: 'var(--text-secondary)',
                  boxShadow: 'var(--nav-shadow)',
                  transition: 'var(--transition-smooth)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <User size={14} />
                  <span>Client Portal</span>
                </Link>
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
                  cursor: 'pointer'
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

      {/* For gallery page on mobile, show the Home button directly in place of the toggle */}
      {isGalleryPage && (
        <div className="mobile-only-home" style={{ display: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 850px) {
              .mobile-only-home { display: flex !important; }
            }
          `}} />
          <Link to="/" style={getBubbleStyle('/')} className="nav-bubble">Home</Link>
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
              {user.role === 'client' ? (
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
                }}>{user.isGuest ? 'Event Gallery' : 'Client Portal'}</Link>
              ) : (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
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
                }}>Admin Dashboard</Link>
              )}
              
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
                <div style={{ display: 'flex', justifyContent: user.isGuest ? 'center' : 'space-between', alignItems: 'center', width: '100%' }}>
                  {(!user.isGuest || user.role !== 'client') && (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {user.role === 'client' ? user.clientName : user.username}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {user.role === 'client' ? (user.isGuest ? 'guest' : 'client') : user.role}
                  </div>
                </div>
                 <button onClick={handleAuthClick} className={user.isGuest ? "btn btn-gold" : "btn btn-danger"} style={{ width: '100%', borderRadius: '50px', fontSize: '0.8rem', padding: '0.5rem' }}>
                  {user.isGuest ? <LogIn size={14} /> : <LogOut size={14} />}
                  <span>{user.isGuest ? 'Sign In' : 'Logout'}</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <Link to="/client-login" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                background: 'var(--nav-bg)',
                border: '1px solid var(--nav-border)',
                borderRadius: '50px',
                padding: '0.6rem 1.5rem',
                boxShadow: 'var(--nav-shadow)',
                textDecoration: 'none'
              }}>
                <User size={16} />
                <span>Client Portal</span>
              </Link>
              <Link to="/guest-login" onClick={() => setMobileMenuOpen(false)} className="nav-bubble-gold" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--bg-deep)',
                textTransform: 'uppercase',
                background: 'var(--gold-gradient)',
                border: '1px solid var(--gold-primary)',
                borderRadius: '50px',
                padding: '0.6rem 1.5rem',
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
    </nav>
  );
}
