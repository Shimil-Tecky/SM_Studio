import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserCheck, ShieldAlert, Check, X, Clock, HelpCircle, Mail } from 'lucide-react';

export default function ClientRequests() {
  const { clientRequests, approveClientRequest, rejectClientRequest, events, user } = useContext(AppContext);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  // Check if current user has access (restricted for Editor and Employee)
  const isRestricted = user?.role === 'Editor' || user?.role === 'Employee';

  if (isRestricted) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)', border: '1px solid #ef4444' }}>
        <ShieldAlert size={60} color="#ef4444" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your profile role ({user.role}) does not have administrative permissions to view or edit access requests. Please contact a Super Admin.
        </p>
      </div>
    );
  }

  const handleApprove = async (reqId, email, eventId) => {
    if (window.confirm(`Are you sure you want to approve this request? This will link guest ${email} as the Client for event ${eventId}.`)) {
      setActionLoading(reqId);
      await approveClientRequest(reqId, email, eventId);
      setActionLoading(null);
    }
  };

  const handleReject = async (reqId) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      setActionLoading(reqId);
      await rejectClientRequest(reqId);
      setActionLoading(null);
    }
  };

  const filteredRequests = (clientRequests || []).filter(req => req.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(13, 13, 13, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1.5px solid var(--gold-primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--gold-glow)'
          }}>
            <UserCheck size={22} color="var(--gold-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '0.5px' }}>Client Access Requests</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review and approve event guest requests to become Client Portal owners.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
        {['pending', 'approved', 'rejected'].map(statusTab => (
          <button
            key={statusTab}
            onClick={() => setFilter(statusTab)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRadius: '50px',
              border: '1.5px solid',
              borderColor: filter === statusTab ? 'var(--gold-primary)' : 'transparent',
              background: filter === statusTab ? 'rgba(212, 175, 55, 0.08)' : 'none',
              color: filter === statusTab ? 'var(--gold-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {statusTab} ({(clientRequests || []).filter(r => r.status === statusTab).length})
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {filteredRequests.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredRequests.map(req => {
            const matchedEvent = events.find(e => e.id === req.event_id);
            const isPending = req.status === 'pending';
            
            return (
              <div 
                key={req.id}
                className="glass-panel card-hover" 
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(13, 13, 13, 0.2)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: req.status === 'approved' ? '#22c55e' : req.status === 'rejected' ? '#ef4444' : 'var(--gold-primary)'
                }} />

                {/* Request Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{req.guest_name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Mail size={12} />
                      <span>{req.guest_email}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Event Association */}
                <div style={{ 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  marginLeft: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: '600', letterSpacing: '0.5px' }}>
                    Target Wedding / Event
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{matchedEvent?.name || req.event_id}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {req.event_id}</span>
                </div>

                {/* Message */}
                {req.message && (
                  <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
                      Message
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                      "{req.message}"
                    </p>
                  </div>
                )}

                {/* Pending Actions */}
                {isPending && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                    <button
                      disabled={actionLoading !== null}
                      onClick={() => handleApprove(req.id, req.guest_email, req.event_id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#22c55e',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <Check size={14} />
                      <span>{actionLoading === req.id ? 'Approving...' : 'Approve'}</span>
                    </button>
                    <button
                      disabled={actionLoading !== null}
                      onClick={() => handleReject(req.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'rgba(13, 13, 13, 0.1)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <HelpCircle size={48} color="var(--text-muted)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No requests found</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            There are currently no access requests in this folder.
          </p>
        </div>
      )}
    </div>
  );
}
