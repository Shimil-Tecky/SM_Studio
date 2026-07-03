import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Plus, Edit3, Trash2, QrCode, Mail, Phone, Calendar, MapPin, Eye, X, Clipboard, ExternalLink, UploadCloud } from 'lucide-react';

export default function EventManagement() {
  const { events, addEvent, updateEvent, deleteEvent, addNotification, deleteMediaFromEvent } = useContext(AppContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [qrModalEvent, setQrModalEvent] = useState(null);
  const [viewingGalleryEvent, setViewingGalleryEvent] = useState(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);

  // Reset selection when modal closes or changes
  useEffect(() => {
    setSelectedPhotoIds([]);
  }, [viewingGalleryEvent]);

  const toggleSelectPhoto = (id) => {
    setSelectedPhotoIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelectedPhotos = () => {
    if (!selectedPhotoIds.length) return;
    if (window.confirm(`Are you sure you want to delete ${selectedPhotoIds.length} selected photos?`)) {
      deleteMediaFromEvent(viewingGalleryEvent.id, selectedPhotoIds, 'photo');
      setViewingGalleryEvent(prev => ({
        ...prev,
        photos: prev.photos.filter(p => !selectedPhotoIds.includes(p.id))
      }));
      setSelectedPhotoIds([]);
    }
  };

  // Form States
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Wedding Photography');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventId, setEventId] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Upcoming');

  const openAddModal = () => {
    setEditingEvent(null);
    setName('');
    setClientName('');
    setEmail('');
    setPhone('');
    setType('Wedding Photography');
    setDate('');
    setVenue('');
    setCoverImage('');
    // Auto-generate ID and Password
    setEventId(`EVT-${Math.floor(1000 + Math.random() * 9000)}`);
    setPassword(Math.random().toString(36).substring(2, 8));
    setStatus('Upcoming');
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setName(evt.name);
    setClientName(evt.clientName);
    setEmail(evt.email);
    setPhone(evt.phone);
    setType(evt.type);
    setDate(evt.date);
    setVenue(evt.venue);
    setCoverImage(evt.coverImage || '');
    setEventId(evt.id);
    setPassword(evt.password);
    setStatus(evt.status);
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      eventId,
      name,
      clientName,
      email,
      phone,
      password,
      type,
      date,
      venue,
      coverImage,
      status
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    setModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this event? All uploaded photos and videos will be lost.")) {
      deleteEvent(id);
    }
  };

  const handleCopyCredentials = (evt) => {
    const creds = `Gallery Link: ${window.location.origin}/client-login\nEvent ID: ${evt.id}\nEmail: ${evt.email}\nPassword: ${evt.password}`;
    navigator.clipboard.writeText(creds);
    addNotification("Credentials Copied", "Copy details to WhatsApp or Email to share with client.", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Event Registry
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Event Management</h2>
        </div>
        <button onClick={openAddModal} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="glass-panel" style={{ padding: '1rem', backgroundColor: 'rgba(13,13,13,0.3)', width: '100%' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event & ID</th>
                <th>Client Name</th>
                <th>Type & Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Portal / QR</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{evt.name}</div>
                    <code style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', backgroundColor: 'transparent', padding: '0' }}>{evt.id}</code>
                  </td>
                  <td>
                    <div>{evt.clientName}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.email}</span>
                  </td>
                  <td>
                    <div>{evt.type}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{evt.date}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{evt.venue}</span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '50px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      backgroundColor: evt.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                      color: evt.status === 'Active' ? '#ef4444' : 'var(--text-secondary)',
                      border: evt.status === 'Active' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {evt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setViewingGalleryEvent(evt)} 
                        title="View Event Gallery"
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem', borderRadius: '4px', color: 'var(--gold-light)' }}
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleCopyCredentials(evt)} 
                        title="Copy Client Login Credentials"
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem', borderRadius: '4px' }}
                      >
                        <Clipboard size={14} />
                      </button>
                      <button 
                        onClick={() => setQrModalEvent(evt)} 
                        title="View Event QR Code"
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem', borderRadius: '4px', color: 'var(--gold-primary)' }}
                      >
                        <QrCode size={14} />
                      </button>
                      <a 
                        href={`/client-dashboard?id=${evt.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Live Guest View"
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem', borderRadius: '4px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Simulating navigating as that user
                          addNotification("Simulating Client Login", `Opening gallery for ${evt.name}`, "info");
                          window.open(`/client-dashboard?id=${evt.id}`, '_blank');
                        }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button 
                        onClick={() => navigate(`/admin/live-sharing?id=${evt.id}`)} 
                        title="Upload Event Photos / Videos"
                        className="btn btn-gold" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textTransform: 'none', letterSpacing: 'normal' }}
                      >
                        <UploadCloud size={12} />
                        <span>Upload Media</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(evt)} 
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '4px', textTransform: 'none', letterSpacing: 'normal' }}
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(evt.id)} 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '4px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>
                {editingEvent ? `Edit Event: ${name}` : 'Create New Event'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
                <style dangerouslySetInnerHTML={{__html: `
                  @media (max-width: 500px) {
                    .form-grid { grid-template-columns: 1fr !important; }
                  }
                `}} />
                
                <div className="form-group">
                  <label className="form-label">Event Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required placeholder="Grand Gala Wedding" />
                </div>

                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="form-control" required placeholder="Elizabeth & William" />
                </div>

                <div className="form-group">
                  <label className="form-label">Client Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required placeholder="elizabeth@luxurymail.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="+1 (555) 987-6543" />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="form-control form-select">
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Wedding Cinematography">Wedding Cinematography</option>
                    <option value="Baptism Events">Baptism Events</option>
                    <option value="Engagement Events">Engagement Events</option>
                    <option value="Birthday Events">Birthday Events</option>
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Live Event Sharing">Live Event Sharing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue Location</label>
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="form-control" required placeholder="The Plaza Hotel, NY" />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Event Cover Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {coverImage ? (
                      <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)', flexShrink: 0 }}>
                        <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => setCoverImage('')}
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            color: '#ff4444',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '4px',
                        border: '1px dashed rgba(255,255,255,0.15)',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        flexShrink: 0
                      }}>
                        No Image
                      </div>
                    )}
                    
                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={coverImage} 
                        onChange={(e) => setCoverImage(e.target.value)} 
                        className="form-control" 
                        placeholder="Paste image URL or upload file..." 
                        style={{ flex: 1 }}
                      />
                      
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '0.65rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <Plus size={14} color="var(--gold-primary)" />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setCoverImage(event.target.result);
                                addNotification("Image Uploaded", `Set "${file.name}" as event cover.`, "success");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pre-Generated Event ID</label>
                  <input type="text" value={eventId} readOnly className="form-control" style={{ backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--gold-primary)', fontWeight: '600' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Pre-Generated Password</label>
                  <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" style={{ color: '#fff', fontWeight: '600' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Event Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control form-select">
                  <option value="Upcoming">Upcoming (Awaiting Shoot)</option>
                  <option value="Active">Active (Real-time Live Sync)</option>
                  <option value="Completed">Completed (Archived)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE PREVIEW MODAL */}
      {qrModalEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setQrModalEvent(null)}>
          <div className="glass-panel" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)',
            textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Event QR Link</h3>
              <button onClick={() => setQrModalEvent(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <img src={qrModalEvent.qrCodeUrl} alt="QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
            </div>

            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>{qrModalEvent.name}</h4>
            <code style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>ID: {qrModalEvent.id}</code>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.4' }}>
              Guests can scan this QR code at the reception table to automatically log in and view photos in real time.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(qrModalEvent.qrCodeUrl);
                  addNotification("QR Link Copied", "QR Code image URL copied to clipboard.", "success");
                }}
                className="btn btn-dark" 
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              >
                Copy Image URL
              </button>
              <a 
                href={qrModalEvent.qrCodeUrl} 
                download={`${qrModalEvent.id}_QR.png`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold" 
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              >
                Download QR
              </a>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY PREVIEW MODAL */}
      {viewingGalleryEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backdropFilter: 'blur(8px)'
        }} onClick={() => setViewingGalleryEvent(null)}>
          <div className="glass-panel" style={{
            maxWidth: '1000px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)',
            maxHeight: '85vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Curator
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.2rem' }}>
                  Gallery: {viewingGalleryEvent.name}
                </h3>
              </div>
              <button 
                onClick={() => setViewingGalleryEvent(null)} 
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Media Count Stats */}
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div>📸 Photos: <strong style={{ color: '#fff' }}>{viewingGalleryEvent.photos?.length || 0}</strong></div>
              <div>🎥 Videos: <strong style={{ color: '#fff' }}>{viewingGalleryEvent.videos?.length || 0}</strong></div>
            </div>

            {/* Photos Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h4 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', borderLeft: '2px solid var(--gold-primary)', paddingLeft: '0.75rem', marginBottom: 0 }}>
                  Photos Gallery
                </h4>
                
                {viewingGalleryEvent.photos && viewingGalleryEvent.photos.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <input 
                        type="checkbox" 
                        checked={viewingGalleryEvent.photos.length > 0 && selectedPhotoIds.length === viewingGalleryEvent.photos.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPhotoIds(viewingGalleryEvent.photos.map(p => p.id));
                          } else {
                            setSelectedPhotoIds([]);
                          }
                        }}
                        style={{ accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                      />
                      <span>Select All</span>
                    </label>

                    {selectedPhotoIds.length > 0 && (
                      <button 
                        onClick={handleDeleteSelectedPhotos}
                        className="btn btn-danger animate-fade-in" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '4px', textTransform: 'none', letterSpacing: 'normal' }}
                      >
                        Delete Selected ({selectedPhotoIds.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {viewingGalleryEvent.photos && viewingGalleryEvent.photos.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '1rem'
                }}>
                  {viewingGalleryEvent.photos.map((photo) => (
                    <div key={photo.id} style={{
                      position: 'relative',
                      height: '120px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedPhotoIds.includes(photo.id) ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: selectedPhotoIds.includes(photo.id) ? '0 0 10px rgba(212, 175, 55, 0.4)' : '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      {/* Selection Checkbox */}
                      <input 
                        type="checkbox" 
                        checked={selectedPhotoIds.includes(photo.id)}
                        onChange={() => toggleSelectPhoto(photo.id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          accentColor: 'var(--gold-primary)',
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          zIndex: 5
                        }}
                      />
                      <img src={photo.url} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedPhotoIds.includes(photo.id) ? 0.75 : 1 }} />

                      {/* Category Label */}
                      <span style={{
                        position: 'absolute',
                        bottom: '0.4rem',
                        left: '0.4rem',
                        fontSize: '0.65rem',
                        color: '#fff',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px'
                      }}>
                        {photo.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  No photos uploaded to this event yet.
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div style={{ marginTop: '1rem' }}>
              <h4 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', marginBottom: '1.25rem', borderLeft: '2px solid var(--gold-primary)', paddingLeft: '0.75rem' }}>
                Cinematic Videos
              </h4>

              {viewingGalleryEvent.videos && viewingGalleryEvent.videos.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {viewingGalleryEvent.videos.map((vid) => (
                    <div key={vid.id} style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={vid.title}>
                          🎬 {vid.title}
                        </h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {vid.duration}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => window.open(vid.url, '_blank')}
                          className="btn btn-dark" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                        >
                          Play
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this video?")) {
                              deleteMediaFromEvent(viewingGalleryEvent.id, vid.id, 'video');
                              // Update modal view reference
                              setViewingGalleryEvent(prev => ({
                                ...prev,
                                videos: prev.videos.filter(v => v.id !== vid.id)
                              }));
                            }
                          }}
                          className="btn btn-danger" 
                          style={{ padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  No cinematic videos uploaded to this event yet.
                </div>
              )}
            </div>

            {/* Direct Upload CTA */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setViewingGalleryEvent(null);
                  navigate(`/admin/live-sharing?id=${viewingGalleryEvent.id}`);
                }}
                className="btn btn-gold"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}
              >
                Upload More Media
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
