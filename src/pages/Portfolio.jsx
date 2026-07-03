import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Edit, Shield } from 'lucide-react';

export default function Portfolio() {
  const { portfolioItems, user } = useContext(AppContext);
  const navigate = useNavigate();
  const canEdit = user && (user.role === 'Super Admin' || user.role === 'Editor');
  const publishedItems = (portfolioItems || []).filter(item => item.status === 'Published');

  return (
    <div style={{
      flex: 1,
      width: '100%',
      backgroundColor: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
      padding: canEdit ? '0rem 2rem 8rem' : '6rem 2rem 8rem'
    }}>
      {/* Dynamic Visual CMS Admin Bar */}
      {canEdit && (
        <div style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          marginLeft: '-2rem',
          marginRight: '-2rem',
          width: 'calc(100% + 4rem)',
          zIndex: 99,
          marginBottom: '4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shield size={16} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '500' }}>
              Logged in as <strong style={{ color: 'var(--gold-primary)' }}>{user.role}</strong> (Portfolio Editor Active)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => navigate('/admin/portfolio')}
              className="btn btn-gold"
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}
            >
              Open Portfolio Editor
            </button>
            <button 
              onClick={() => navigate('/admin/content')}
              className="btn btn-gold"
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}
            >
              Open Homepage Editor
            </button>
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-outline"
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', textTransform: 'none', letterSpacing: 'normal' }}
            >
              Control Panel
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
          {canEdit && (
            <button 
              onClick={() => navigate('/admin/portfolio')} 
              className="btn btn-outline" 
              style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.75rem',
                padding: '0.3rem 0.6rem',
                borderColor: 'var(--gold-primary)',
                color: 'var(--gold-primary)',
                backgroundColor: 'rgba(10,10,10,0.85)',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: 'normal',
                zIndex: 10
              }}
            >
              <Edit size={12} />
              <span>Edit Showcase</span>
            </button>
          )}
          <span style={{
            fontSize: '0.85rem',
            color: 'var(--gold-primary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Visual Masterpieces
          </span>
          <h1 className="font-serif" style={{ fontSize: '3rem', color: '#fff', fontWeight: '600' }}>
            Signature Showcase
          </h1>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--gold-primary)', margin: '1.5rem auto 0' }}></div>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            marginTop: '1.5rem',
            maxWidth: '600px',
            marginInline: 'auto',
            lineHeight: '1.6'
          }}>
            Explore our curated selection of luxury wedding, ceremony, and milestone event stories captured with timeless elegance and classic romance.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {publishedItems.map((item, idx) => (
            <div key={item.id || idx} style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '320px',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }} className="portfolio-card">
              <style dangerouslySetInnerHTML={{__html: `
                .portfolio-card img {
                  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .portfolio-card:hover img {
                  transform: scale(1.08);
                }
                .portfolio-overlay {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 80%);
                  opacity: 0;
                  display: flex;
                  align-items: flex-end;
                  padding: 2rem;
                  transition: opacity 0.4s ease;
                }
                .portfolio-card:hover .portfolio-overlay {
                  opacity: 1;
                }
              `}} />
              <img src={item.url} alt={item.title || "Portfolio Work"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="portfolio-overlay">
                <div style={{ width: '100%' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{item.cat}</span>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '0.3rem', fontWeight: '500' }}>{item.title || "Antigravity Editorial"}</h4>
                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.4' }}>{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
