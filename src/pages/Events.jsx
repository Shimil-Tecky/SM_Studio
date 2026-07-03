import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Calendar, MapPin, User, QrCode, ArrowRight } from 'lucide-react';

export default function Events() {
  const { events } = useContext(AppContext);

  // Filter events: Active and Upcoming
  const filteredEvents = (events || []).filter(
    (evt) => evt.status === 'Active' || evt.status === 'Upcoming'
  );

  return (
    <div style={{
      flex: 1,
      width: '100%',
      backgroundColor: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
      padding: '6rem 2rem 8rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{
            fontSize: '0.85rem',
            color: 'var(--gold-primary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Live Event Registry
          </span>
          <h1 className="font-serif" style={{ fontSize: '3rem', color: '#fff', fontWeight: '600' }}>
            Active & Upcoming Events
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
            Scan your event QR code to access professional real-time photos instantly, or browse scheduled milestone stories.
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2.5rem'
          }}>
            {filteredEvents.map((evt) => {
              const isActive = evt.status === 'Active';
              return (
                <div 
                  key={evt.id} 
                  className="glass-panel" 
                  style={{
                    padding: '2rem',
                    backgroundColor: 'rgba(13, 13, 13, 0.45)',
                    border: isActive ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    boxShadow: isActive ? 'var(--gold-glow)' : '0 10px 30px rgba(0,0,0,0.35)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Status Indicator Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '50px',
                    backgroundColor: isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.08)',
                    color: isActive ? '#ef4444' : 'var(--gold-primary)',
                    border: isActive ? '1px solid #ef4444' : '1px solid var(--gold-primary)'
                  }}>
                    {isActive ? 'Live Now' : 'Upcoming'}
                  </span>

                  <div>
                    {/* Event Name */}
                    <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', paddingRight: '4.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {evt.name}
                    </h3>
                    
                    {/* Client Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
                      <User size={14} />
                      <span>{evt.clientName}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} />
                        <span>{evt.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} />
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed rgba(212, 175, 55, 0.15)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      backgroundColor: '#fff', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                      marginBottom: '0.75rem'
                    }}>
                      <img 
                        src={evt.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/client-login?qr=' + evt.id)}`} 
                        alt="Event QR Code" 
                        style={{ width: '130px', height: '130px', display: 'block' }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <QrCode size={12} color="var(--gold-primary)" />
                      <span>Scan for Guest Gallery</span>
                    </span>
                  </div>

                  {/* Portal Access Button */}
                  <div>
                    {isActive ? (
                      <Link 
                        to={`/client-dashboard?id=${evt.id}`}
                        className="btn btn-gold"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                      >
                        <span>View Live Gallery</span>
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <div 
                        style={{ 
                          width: '100%', 
                          padding: '0.65rem', 
                          fontSize: '0.85rem',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          backgroundColor: 'rgba(255,255,255,0.01)',
                          color: 'var(--text-muted)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Awaiting Launch
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)' }}>
            <Calendar size={48} color="var(--gold-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>No Active or Upcoming Events</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              Check back soon for live luxury weddings and ceremonies scheduled at the studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
