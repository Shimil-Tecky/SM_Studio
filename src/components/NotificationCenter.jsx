import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useContext(AppContext);

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#d4af37" />;
      case 'warning':
        return <AlertTriangle size={18} color="#ef4444" />;
      case 'info':
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(212, 175, 55, 0.4)';
      case 'warning':
        return 'rgba(220, 38, 38, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '360px',
      width: 'calc(100% - 40px)',
      pointerEvents: 'none'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .notif-close-btn {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .notif-close-btn:hover {
          color: var(--gold-primary) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}} />
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            padding: '1rem',
            border: `1px solid ${getBorderColor(notif.type)}`,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
            position: 'relative'
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => removeNotification(notif.id)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            className="notif-close-btn"
          >
            <X size={14} />
          </button>

          <div style={{ marginTop: '2px' }}>
            {getIcon(notif.type)}
          </div>
          <div style={{ flex: 1, paddingRight: '1rem' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.2rem', color: '#fff' }}>
              {notif.title}
            </h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {notif.message}
            </p>
            <span style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-muted)', 
              display: 'block', 
              marginTop: '0.4rem', 
              textAlign: 'right' 
            }}>
              {notif.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
