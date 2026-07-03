import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Camera, LogOut, User, Shield, Menu, X, Globe, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
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
      background: active ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: active ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '50px',
      padding: '0.55rem 1.3rem',
      color: active ? 'var(--gold-primary)' : 'var(--text-secondary)',
      boxShadow: active ? '0 4px 15px rgba(212, 175, 55, 0.15)' : '0 4px 12px rgba(0,0,0,0.25)',
      transition: 'var(--transition-smooth)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer'
    };
  };

  const showBackButton = location.pathname !== '/';

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent',
      border: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50px',
              padding: '0.55rem 1.3rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
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
        <Link to="/" className="nav-bubble" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '50px',
          padding: '0.5rem 1.25rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          transition: 'var(--transition-smooth)',
          textDecoration: 'none'
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            background: 'var(--gold-gradient)',
            padding: '0.4rem',
            borderRadius: '25%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--gold-glow)'
          }}>
            <Camera size={20} color="#050505" strokeWidth={2.5} />
          </div>
          <span className="font-logo" style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Antigravity Studio Live
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
        <style dangerouslySetInnerHTML={{__html: `
          .nav-bubble:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
            color: #fff !important;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.08) !important;
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
          @media (max-width: 850px) {
            .desktop-nav { display: none !important; }
            .mobile-nav-toggle { display: flex !important; }
          }
          @media (min-width: 851px) {
            .mobile-nav-toggle { display: none !important; }
            .mobile-menu { display: none !important; }
          }
        `}} />
        
        <Link to="/" style={getBubbleStyle('/')} className="nav-bubble">Home</Link>
        <Link to="/portfolio" style={getBubbleStyle('/portfolio')} className="nav-bubble">Portfolio</Link>
        <Link to="/events" style={getBubbleStyle('/events')} className="nav-bubble">Events</Link>
        
        {user ? (
          <>
            {user.role === 'client' ? (
              <Link to="/client-dashboard" style={getBubbleStyle('/client-dashboard')} className="nav-bubble">Client Portal</Link>
            ) : (
              <Link to="/admin" style={getBubbleStyle('/admin')} className="nav-bubble">Admin Dashboard</Link>
            )}
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50px',
              padding: '0.4rem 1.25rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>
                  {user.role === 'client' ? user.clientName : user.username}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                color: '#ef4444',
                padding: '0.3rem 0.75rem',
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
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/client-login" className="nav-bubble" style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50px',
              padding: '0.55rem 1.3rem',
              color: 'var(--text-secondary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'var(--transition-smooth)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <User size={14} />
              <span>Client Portal</span>
            </Link>
            <Link to="/admin-login" className="nav-bubble-gold" style={{
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
              <Shield size={14} />
              <span>Admin Login</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-nav-toggle nav-bubble" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        width: '42px',
        height: '42px',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--gold-primary)',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        transition: 'var(--transition-smooth)',
        padding: 0
      }}>
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(13, 13, 13, 0.95)',
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
            color: '#fff',
            textTransform: 'uppercase',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            textDecoration: 'none'
          }}>Home</Link>
          <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            textTransform: 'uppercase',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            textDecoration: 'none'
          }}>Portfolio</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            textTransform: 'uppercase',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '50px',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            textDecoration: 'none'
          }}>Events</Link>
          
          {user ? (
            <>
              {user.role === 'client' ? (
                <Link to="/client-dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#fff',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '50px',
                  padding: '0.6rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  textDecoration: 'none'
                }}>Client Portal</Link>
              ) : (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#fff',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '50px',
                  padding: '0.6rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  textDecoration: 'none'
                }}>Admin Dashboard</Link>
              )}
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                    {user.role === 'client' ? user.clientName : user.username}
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
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
              <Link to="/client-login" onClick={() => setMobileMenuOpen(false)} className="nav-bubble" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#fff',
                textTransform: 'uppercase',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '50px',
                padding: '0.6rem 1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                textDecoration: 'none'
              }}>
                <User size={16} />
                <span>Client Portal</span>
              </Link>
              <Link to="/admin-login" onClick={() => setMobileMenuOpen(false)} className="nav-bubble-gold" style={{
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
                <Shield size={16} />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
