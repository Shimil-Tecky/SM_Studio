import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Camera, Calendar, Play, QrCode, Phone, Mail, Award, Clock, Heart, ArrowRight, Edit, Shield } from 'lucide-react';

export default function Home() {
  const { events, cmsContent, user, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const canEdit = user && (user.role === 'Super Admin' || user.role === 'Editor');
  const [qrInput, setQrInput] = useState('');
  const [generatedQr, setGeneratedQr] = useState(null);
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultEventType, setConsultEventType] = useState('wedding');

  const activeEvents = events.filter(e => e.status === 'Active');

  const cms = cmsContent || {
    hero: { title: "Antigravity Studio Live", subtitle: "Relive Every Moment Instantly", desc: "Luxury wedding and milestone photography meets...", bgImage: "/hero_background.png" },
    services: { tagline: "What We Do", heading: "Our Premium Services", list: [] },
    philosophy: { tagline: "Studio Philosophy", heading: "Where Luxury Meets Instant Emotion", quote: "", paragraph1: "", paragraph2: "", author: "The Antigravity Creative Team", location: "New York • Milan • Paris", image: "/studio_thoughts.png" },
    testimonials: { tagline: "Client Praise", heading: "Luxury Chronicles", list: [] },
    contact: { tagline: "Reservations", heading: "Begin Your Journey", desc: "Reserve our luxury...", phone: "+1 (555) 019-2831", email: "reservations@antigravity.studio" }
  };

  const hero = cms.hero;
  const srvCMS = cms.services;
  const phil = cms.philosophy;
  const test = cms.testimonials;
  const cont = cms.contact;

  const serviceIcons = [Camera, Play, Heart, Award, Clock, QrCode];
  const services = (srvCMS.list || []).map((item, idx) => ({
    title: item.title,
    icon: serviceIcons[idx % serviceIcons.length] || Camera,
    desc: item.desc
  }));



  const handleGenerateQr = (e) => {
    e.preventDefault();
    if (qrInput.trim()) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        window.location.origin + '/client-dashboard?id=' + qrInput.trim() + '&qr=true'
      )}`;
      setGeneratedQr(qrUrl);
    }
  };

  return (
    <div style={{ 
      width: '100%',
      backgroundColor: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
      position: 'relative'
    }}>

      {/* 1. HERO SECTION + HAPPENING NOW — shared background wrapper */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `url(${hero.bgImage || '/hero_background.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Cinematic Background Video — covers the whole wrapper including ticker */}
        {(!hero.bgImage || !hero.bgImage.startsWith('data:')) && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              opacity: 'var(--video-opacity)'
            }}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-34346-large.mp4" type="video/mp4" />
          </video>
        )}

        {/* Ambient Dark Gradient Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background: 'var(--hero-overlay)'
        }}></div>

        {/* ── Hero header ── */}
        <header style={{
          position: 'relative',
          height: '92vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}>
          {/* Hero Content */}
          <div className="glass-panel animate-fade-in home-hero-panel" style={{
            padding: '3.5rem',
            maxWidth: '800px',
            textAlign: 'center',
            backgroundColor: 'var(--glass-bg)',
            border: 'var(--glass-border)',
            margin: '0 1rem',
            position: 'relative'
          }}>
            {canEdit && (
              <button
                onClick={() => navigate('/admin/content?tab=hero')}
                className="btn btn-outline"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
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
                  letterSpacing: 'normal'
                }}
              >
                <Edit size={12} />
                <span>Edit Hero</span>
              </button>
            )}
            <h1 className="font-logo" style={{ fontSize: '1.25rem', letterSpacing: '4px', color: 'var(--gold-primary)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              {hero.title}
            </h1>
            <h2 className="font-serif" style={{
              fontSize: 'calc(2.2rem + 1.5vw)',
              fontWeight: '600',
              lineHeight: '1.15',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              letterSpacing: '1px'
            }}>
              {hero.subtitle.includes('Instantly') ? (
                <>
                  {hero.subtitle.replace('Instantly', '')}
                  <span className="text-gold-gradient" style={{ fontWeight: '700' }}>Instantly</span>
                </>
              ) : (
                hero.subtitle
              )}
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginBottom: '0',
              maxWidth: '600px',
              marginInline: 'auto'
            }} dangerouslySetInnerHTML={{ __html: hero.desc }} />
          </div>
        </header>

        {/* ── 2. ACTIVE LIVE EVENTS TICKER (inside shared background) ── */}
        {activeEvents.length > 0 && (
          <section className="home-ticker" style={{
            position: 'relative',
            zIndex: 3,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
            padding: '1.2rem 2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'inline-block',
                boxShadow: '0 0 10px #ef4444',
                animation: 'pulseGold 1.5s infinite'
              }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Happening Now:
              </span>
            </div>
            {activeEvents.map(evt => (
              <Link
                key={evt.id}
                to={`/client-dashboard?id=${evt.id}`}
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{evt.name}</span>
                <ArrowRight size={14} color="var(--gold-primary)" />
              </Link>
            ))}
          </section>
        )}
      </div>{/* end hero+ticker wrapper */}

      {/* 3. SERVICES SECTION */}
      <section style={{ padding: '7rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {canEdit && (
          <button 
            onClick={() => navigate('/admin/content?tab=services')} 
            className="btn btn-outline" 
            style={{ 
              position: 'absolute', 
              top: '2rem', 
              right: '2rem', 
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
            <span>Edit Services</span>
          </button>
        )}
        <div className="home-services-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>{srvCMS.tagline}</span>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{srvCMS.heading}</h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--gold-primary)', margin: '1rem auto' }}></div>
        </div>

        <div className="home-services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="glass-panel home-service-card" style={{
                padding: '2.5rem 2rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.25)'
                }}>
                  <Icon size={24} color="var(--gold-primary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>{srv.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.5 THOUGHTS OF THE STUDIO SECTION */}
      <section style={{
        padding: '7rem 2rem',
        backgroundColor: 'var(--bg-alternate)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {canEdit && (
          <button 
            onClick={() => navigate('/admin/content?tab=philosophy')} 
            className="btn btn-outline" 
            style={{ 
              position: 'absolute', 
              top: '2rem', 
              right: '2rem', 
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
            <span>Edit Philosophy</span>
          </button>
        )}
        {/* Subtle decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="home-philosophy-grid" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Column 1: Image Frame */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 15px rgba(212,175,55,0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            aspectRatio: '4/3',
            transition: 'var(--transition-smooth)',
            cursor: 'pointer'
          }} className="studio-thoughts-card">
            <style dangerouslySetInnerHTML={{__html: `
              .studio-thoughts-card img {
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .studio-thoughts-card:hover img {
                transform: scale(1.05);
              }
              .studio-thoughts-card:hover {
                border-color: rgba(212, 175, 55, 0.45);
                box-shadow: 0 20px 40px rgba(0,0,0,0.8), var(--gold-glow);
              }
            `}} />
            <img 
              src={phil.image || "/studio_thoughts.png"} 
              alt="Artistic Camera Detail" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Watermark overlay inside frame */}
            <div className="watermark-overlay" style={{ opacity: 0.5 }}>
              <div className="watermark-text" style={{ fontSize: '1rem', padding: '0.25rem 1rem' }}>
                Antigravity Craft
              </div>
            </div>
          </div>

          {/* Column 2: Narrative Text */}
          <div className="home-philosophy-text" style={{ textAlign: 'left' }}>
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--gold-primary)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              {phil.tagline}
            </span>
            <h2 className="font-serif" style={{
              fontSize: 'calc(1.8rem + 1vw)',
              lineHeight: '1.25',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              {phil.heading.includes('Instant Emotion') ? (
                <>
                  {phil.heading.replace('Instant Emotion', '')}
                  <span className="text-gold-gradient" style={{ fontWeight: '700' }}>Instant Emotion</span>
                </>
              ) : (
                phil.heading
              )}
            </h2>
            <div className="gold-divider" style={{
              width: '60px',
              height: '2px',
              backgroundColor: 'var(--gold-primary)',
              marginBottom: '2rem'
            }} />
            
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              lineHeight: '1.75',
              fontStyle: 'italic',
              fontWeight: '300'
            }} dangerouslySetInnerHTML={{ __html: phil.quote }} />
            
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              lineHeight: '1.75'
            }} dangerouslySetInnerHTML={{ __html: phil.paragraph1 }} />

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: '1.75'
            }} dangerouslySetInnerHTML={{ __html: phil.paragraph2 }} />

            <div className="home-philosophy-quote-block" style={{
              borderLeft: '2px solid var(--gold-primary)',
              paddingLeft: '1.25rem',
              marginTop: '2rem'
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                {phil.author}
              </p>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {phil.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QR CODE SCAN INSTANT GALLERY SECTION */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="glass-panel home-qr-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          padding: '4rem 3rem',
          alignItems: 'center'
        }}>
          <div className="home-qr-text">
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>Instant Portal</span>
            <h2 className="font-serif" style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Scan & Relive</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Are you a guest at an Antigravity Studio Live event? Enter your <b>Event ID</b> below to generate and scan your exclusive high-speed access code, or scan it directly from cards at the venue.
            </p>
            <form onSubmit={handleGenerateQr} className="home-qr-form" style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="Enter Event ID (e.g. ROYAL-2026)"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-gold" style={{ paddingInline: '1.5rem' }}>Generate</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            {generatedQr ? (
              <div className="glass-card animate-fade-in" style={{ padding: '2rem', border: '1px solid var(--gold-primary)', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
                <img src={generatedQr} alt="Event QR Code" style={{ width: '200px', height: '200px', borderRadius: '4px' }} />
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {qrInput.toUpperCase()} QR Code
                </h4>
                <button 
                  onClick={() => navigate(`/client-dashboard?id=${qrInput}&qr=true`)}
                  className="btn btn-dark" 
                  style={{ marginTop: '1rem', width: '100%', fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  Go to Gallery Directly
                </button>
              </div>
            ) : (
              <div style={{
                width: '240px',
                height: '240px',
                border: '2px dashed var(--gold-secondary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                gap: '1rem',
                backgroundColor: 'rgba(255,255,255,0.01)'
              }}>
                <QrCode size={48} strokeWidth={1} color="var(--gold-secondary)" />
                <span style={{ fontSize: '0.85rem' }}>QR Code Preview Area</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-alternate)', position: 'relative' }}>
        {canEdit && (
          <button 
            onClick={() => navigate('/admin/content?tab=testimonials')} 
            className="btn btn-outline" 
            style={{ 
              position: 'absolute', 
              top: '2rem', 
              right: '2rem', 
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
            <span>Edit Praise</span>
          </button>
        )}
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>{test.tagline}</span>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '3.5rem' }}>{test.heading}</h2>

          <div className="home-testimonials-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {(test.list || []).map((t, idx) => (
              <div key={idx} className="glass-panel home-testimonial-card" style={{ padding: '3rem 2rem', flex: '1 1 340px', maxWidth: '450px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <span key={i} style={{ color: 'var(--gold-primary)', fontSize: '1.25rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: t.text }} />
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600' }}>{t.author}</h4>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{t.tagline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {canEdit && (
          <button 
            onClick={() => navigate('/admin/content?tab=contact')} 
            className="btn btn-outline" 
            style={{ 
              position: 'absolute', 
              top: '2rem', 
              right: '2rem', 
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
            <span>Edit Contact</span>
          </button>
        )}
        <div className="home-contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'start'
        }}>
          <div className="home-contact-info">
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>{cont.tagline}</span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{cont.heading}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }} dangerouslySetInnerHTML={{ __html: cont.desc }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: 'var(--gold-primary)' }}><Phone size={20} /></div>
                <div>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>Phone / WhatsApp</h5>
                  <p style={{ fontSize: '0.95rem' }}>{cont.phone}</p>
                </div>
              </div>

              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: 'var(--gold-primary)' }}><Mail size={20} /></div>
                <div>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>Email Inquiry</h5>
                  <p style={{ fontSize: '0.95rem' }}>{cont.email}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const eventLabels = {
              wedding: 'Wedding Ceremony & Reception',
              baptism: 'Baptism / Naming Ceremony',
              gala: 'Corporate Gala / Press Event',
              other: 'Portrait / Specialized Session'
            };
            const selectedLabel = eventLabels[consultEventType] || consultEventType;
            const msg = `Hello Antigravity Studio, I would like to request a reservation/consultation.\n\n*Name:* ${consultName}\n*Email:* ${consultEmail}\n*Event Type:* ${selectedLabel}`;
            const whatsappNum = cont.whatsapp || '9846032602';
            const prefix = whatsappNum.length === 10 ? '91' : '';
            const whatsappUrl = `https://wa.me/${prefix}${whatsappNum}?text=${encodeURIComponent(msg)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          }} className="glass-panel" style={{ padding: '2.5rem', backgroundColor: 'rgba(13,13,13,0.4)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Consultation Request</h3>
            
            <div className="form-group">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="Alexander Vance" 
                value={consultName} 
                onChange={(e) => setConsultName(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                placeholder="alex@vancemail.org" 
                value={consultEmail} 
                onChange={(e) => setConsultEmail(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select 
                className="form-control form-select" 
                required 
                value={consultEventType} 
                onChange={(e) => setConsultEventType(e.target.value)}
              >
                <option value="wedding">Wedding Ceremony & Reception</option>
                <option value="baptism">Baptism / Naming Ceremony</option>
                <option value="gala">Corporate Gala / Press Event</option>
                <option value="other">Portrait / Specialized Session</option>
              </select>
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
              Request Consultation
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'relative',
        padding: '3.5rem 2rem 3rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        {canEdit && (
          <button 
            onClick={() => navigate('/admin/content?tab=contact')} 
            className="btn btn-outline" 
            style={{ 
              position: 'absolute', 
              top: '1.5rem', 
              right: '2rem', 
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
            <span>Edit Footer Links</span>
          </button>
        )}
        <div className="font-logo" style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', marginBottom: '1rem' }}>
          ANTIGRAVITY STUDIO LIVE
        </div>
        <p style={{ marginBottom: '1.5rem' }}>{cont.footerText || "Fifth Avenue, New York, NY • © 2026. All luxury rights reserved."}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <a href={`https://www.instagram.com/${cont.instagram || '_shimil_m.p_'}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>Instagram</a>
          <a href={cont.vimeo || "https://vimeo.com/user260728000?fl=pp&fe=sh"} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>Vimeo</a>
          <a href={`https://wa.me/${(cont.whatsapp || '9846032602').length === 10 ? '91' : ''}${cont.whatsapp || '9846032602'}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>WhatsApp</a>
          <a href={cont.pinterest || "#"} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>Pinterest</a>
        </div>
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Theme:</span>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--nav-bg)', padding: '0.25rem', borderRadius: '50px', border: '1px solid var(--nav-border)' }}>
            {['system', 'light', 'dark'].map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    background: active ? 'var(--gold-gradient)' : 'transparent',
                    border: 'none',
                    color: active ? '#050505' : 'var(--text-secondary)',
                    borderRadius: '50px',
                    padding: '0.4rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title={`Switch to ${t} theme`}
                >
                  {t === 'light' && '☀️'}
                  {t === 'dark' && '🌙'}
                  {t === 'system' && '💻'}
                  <span style={{ fontSize: '0.7rem' }}>{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline fallback for Lucide icon
function UserIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
