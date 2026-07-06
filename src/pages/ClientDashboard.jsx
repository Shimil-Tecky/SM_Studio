import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Camera, Calendar, MapPin, User, Heart, Download, Share2, 
  Search, Eye, ShieldAlert, Sparkles, FolderDown, Image as ImageIcon, 
  Play, RefreshCw, Layers, CheckCircle
} from 'lucide-react';

export default function ClientDashboard() {
  const { user, events, toggleLikePhoto, addNotification } = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('photos'); // photos, videos, favorites, downloadCenter
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [shareModalData, setShareModalData] = useState(null);
  const [bulkDownloading, setBulkDownloading] = useState(false);

  // Redirect if not logged in as client
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/client-login', { replace: true });
    }
  }, [user, navigate]);

  // Find the event for the logged-in client
  const event = events.find(e => e.id === user?.eventId);

  if (!event) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <ShieldAlert size={60} color="var(--gold-primary)" style={{ marginBottom: '1.5rem' }} />
        <h2>Event Gallery Unsynchronized</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Your event ID is not mapped to any active record.</p>
        <button onClick={() => navigate('/client-login')} className="btn btn-gold">Return to Login</button>
      </div>
    );
  }

  // Filter Categories - start with default ones, and dynamically add any custom ones present in the photos
  const defaultCategories = ['All', 'Bride', 'Groom', 'Family', 'Ceremony', 'Reception'];
  const photoCategories = (event.photos || [])
    .map(p => p.category)
    .filter(Boolean)
    .map(c => {
      const standardMap = {
        bride: 'Bride',
        groom: 'Groom',
        family: 'Family',
        ceremony: 'Ceremony',
        reception: 'Reception'
      };
      const lower = c.trim().toLowerCase();
      if (standardMap[lower]) return standardMap[lower];
      return c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    });

  const categories = Array.from(new Set([...defaultCategories, ...photoCategories]));

  // AI & Tag Filtering Logic
  const getFilteredPhotos = () => {
    let photosList = event.photos || [];

    // Filter by Category
    if (filter !== 'All') {
      photosList = photosList.filter(p => p.category.toLowerCase() === filter.toLowerCase());
    }

    // Filter by AI Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Look for natural search commands like "show photos with bride", "stage photos", "find gold ring"
      photosList = photosList.filter(p => {
        // Match category
        if (p.category.toLowerCase().includes(q)) return true;
        // Match specific tags
        const matchedTag = p.tags.some(tag => q.includes(tag) || tag.includes(q));
        if (matchedTag) return true;
        // Match text descriptors
        if (q.includes("bride") && p.tags.includes("bride")) return true;
        if (q.includes("groom") && p.tags.includes("groom")) return true;
        if (q.includes("altar") || q.includes("church") || q.includes("stage") || q.includes("ceremony")) {
          if (p.tags.includes("ceremony") || p.tags.includes("stage")) return true;
        }
        if (q.includes("ring") && p.tags.includes("rings")) return true;
        if (q.includes("cake") && p.tags.includes("cake")) return true;
        if (q.includes("dance") || q.includes("party") || q.includes("reception")) {
          if (p.tags.includes("reception") || p.tags.includes("dance")) return true;
        }
        return false;
      });
    }

    return photosList;
  };

  const filteredPhotos = getFilteredPhotos();
  const favoritePhotos = (event.photos || []).filter(p => p.likedByUser);

  // Handle Photo Selection for Download
  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const handleSelectAllPhotos = () => {
    const ids = filteredPhotos.map(p => p.id);
    setSelectedPhotos(ids);
    addNotification("Selection Updated", `Selected all ${ids.length} visible photos.`, "info");
  };

  const handleClearSelection = () => {
    setSelectedPhotos([]);
  };

  // Simulate Bulk Downloading
  const triggerBulkDownload = (type) => {
    setBulkDownloading(true);
    let count = 0;
    if (type === 'selected') count = selectedPhotos.length;
    else if (type === 'complete') count = event.photos.length;

    setTimeout(() => {
      setBulkDownloading(false);
      setSelectedPhotos([]);
      addNotification(
        "Download Complete",
        `Archived and downloaded ${count} photos in full print quality.`,
        "success"
      );
      
      // Trigger a raw browser download of a dummy file as confirmation
      const element = document.createElement("a");
      const file = new Blob(["Simulated Luxury Gallery Archive - Antigravity Studio Live"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${event.name.replace(/\s+/g, '_')}_Gallery_HighRes.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 3000);
  };

  const handleShareClick = (photo) => {
    setShareModalData(photo);
  };

  return (
    <div style={{ width: '100%', minHeight: '90vh', background: 'transparent', color: '#fff', paddingBottom: '5rem' }}>
      
      {/* 1. HERO BANNER INFO */}
      <section style={{
        position: 'relative',
        padding: '4rem 2rem 3rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.7), #050505), url(${event.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.4rem 1rem', borderRadius: '50px', marginBottom: '1rem' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: event.status === 'Active' ? '#ef4444' : '#6b7280', borderRadius: '50%', boxShadow: event.status === 'Active' ? '0 0 8px #ef4444' : 'none' }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gold-primary)' }}>
                {event.status === 'Active' ? 'LIVE EVENT STREAMING' : 'ARCHIVED EVENT'}
              </span>
            </div>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#fff', textAlign: 'left' }}>{event.name}</h1>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} />{event.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} />{event.venue}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} />Photographer: {event.photographer}</span>
            </div>
          </div>

          {/* Real-time stats */}
          <div className="glass-panel" style={{ display: 'flex', gap: '1.5rem', padding: '1.2rem 2rem', backgroundColor: 'rgba(13,13,13,0.5)', width: 'fit-content' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: '700' }}>{event.photos?.length || 0}</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Photos</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: '700' }}>{event.videos?.length || 0}</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Videos</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: '700' }}>{event.activeClients}</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Guests</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB NAVIGATION TABS */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingInline: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('photos')}
              className={`btn`} 
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'photos' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'photos' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '0',
                paddingBottom: '1rem',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <ImageIcon size={16} />
              <span>Live Photos</span>
            </button>

            <button 
              onClick={() => setActiveTab('videos')}
              className={`btn`}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'videos' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'videos' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '0',
                paddingBottom: '1rem',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Play size={16} />
              <span>Live Videos</span>
            </button>

            <button 
              onClick={() => setActiveTab('favorites')}
              className={`btn`}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'favorites' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'favorites' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '0',
                paddingBottom: '1rem',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Heart size={16} />
              <span>Favorites ({favoritePhotos.length})</span>
            </button>

            <button 
              onClick={() => setActiveTab('downloadCenter')}
              className={`btn`}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'downloadCenter' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                color: activeTab === 'downloadCenter' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '0',
                paddingBottom: '1rem',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <FolderDown size={16} />
              <span>Download Center</span>
            </button>
          </div>

          {/* Quick settings controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <input 
                type="checkbox" 
                checked={watermarkEnabled}
                onChange={() => setWatermarkEnabled(!watermarkEnabled)}
                style={{ accentColor: 'var(--gold-primary)' }}
              />
              <span>Watermark Previews</span>
            </label>

            {event.status === 'Active' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <RefreshCw size={12} className={autoRefresh ? "animate-pulse-gold" : ""} />
                <span>Auto-Refresh Streams</span>
              </label>
            )}
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTERS PANEL (Only on photos or download tabs) */}
      {(activeTab === 'photos' || activeTab === 'downloadCenter') && (
        <section style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingInline: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Filter tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFilter(cat)}
                  className="btn"
                  style={{
                    padding: '0.4rem 1rem',
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    backgroundColor: filter === cat ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                    color: filter === cat ? 'var(--bg-deep)' : 'var(--text-secondary)',
                    border: filter === cat ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* AI Search input */}
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <input 
                type="text" 
                placeholder='AI Search: "Show bride photos" or "stage"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2rem', fontSize: '0.85rem' }}
              />
              <Search size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              {searchQuery && (
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--gold-primary)', fontWeight: '700', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Sparkles size={10} />
                  <span>AI</span>
                </span>
              )}
            </div>

          </div>
        </section>
      )}

      {/* 4. CONTENT GRID PORTION */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingInline: '2rem' }}>
        
        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div>
            {filteredPhotos.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)' }}>
                <ImageIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No Photos Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {searchQuery ? 'Try refining your AI search parameters.' : 'No photos have been uploaded to this category yet.'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="glass-panel"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '320px',
                      backgroundColor: '#0a0a0a',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt="Event Shoot" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setPreviewPhoto(photo)}
                    />
                    
                    {/* Watermark Overlay */}
                    {watermarkEnabled && (
                      <div className="watermark-overlay">
                        <div className="watermark-text" style={{ fontSize: '0.9rem', padding: '0.2rem 0.5rem' }}>
                          ANTIGRAVITY LIVE
                        </div>
                      </div>
                    )}

                    {/* Bottom Bar Controls */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                      padding: '1.25rem 1rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 11
                    }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '500' }}>
                          {photo.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{photo.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => toggleLikePhoto(event.id, photo.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: photo.likedByUser ? '#ef4444' : '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                        >
                          <Heart size={16} fill={photo.likedByUser ? "#ef4444" : "none"} />
                          <span>{photo.likes}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShareClick(photo)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                        >
                          <Share2 size={16} />
                        </button>
                        
                        <a 
                          href={photo.url} 
                          download={`Antigravity_${photo.id}.jpg`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                          onClick={() => addNotification("Download Triggered", "Downloading high resolution photo.", "info")}
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIDEOS STREAMING TAB */}
        {activeTab === 'videos' && (
          <div>
            {(event.videos || []).length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)' }}>
                <Play size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No Videos Available</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Live cinematics and video clips will show up here as editors upload highlight loops.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                gap: '2rem'
              }} className="video-grid">
                <style dangerouslySetInnerHTML={{__html: `
                  @media (max-width: 500px) {
                    .video-grid { grid-template-columns: 1fr !important; }
                  }
                `}} />
                {event.videos.map((vid) => (
                  <div key={vid.id} className="glass-panel" style={{ padding: '1rem', backgroundColor: 'rgba(13,13,13,0.4)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '260px', backgroundColor: '#000' }}>
                      <video 
                        src={vid.url} 
                        controls 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', right: '0.75rem', bottom: '0.75rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold-primary)' }}>
                        {vid.duration}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>{vid.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploaded: {vid.timestamp}</span>
                      </div>
                      <a 
                        href={vid.url} 
                        download={`${vid.title.replace(/\s+/g, '_')}.mp4`} 
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '4px' }}
                      >
                        <Download size={12} />
                        <span>Download Stream</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES COLLECTION TAB */}
        {activeTab === 'favorites' && (
          <div>
            {favoritePhotos.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)' }}>
                <Heart size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>Your Favorites Collection is Empty</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Tap the heart icon on any photo in the live feed to compile your favorites here.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {favoritePhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="glass-panel"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '320px',
                      backgroundColor: '#0a0a0a',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt="Favorite" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setPreviewPhoto(photo)}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                      padding: '1.25rem 1rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 11
                    }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {photo.category}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => toggleLikePhoto(event.id, photo.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Heart size={16} fill="#ef4444" />
                        </button>
                        <a href={photo.url} download target="_blank" rel="noreferrer" style={{ color: '#fff' }}>
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOWNLOAD CENTER TAB */}
        {activeTab === 'downloadCenter' && (
          <div>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'rgba(13,13,13,0.3)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Bulk Archiver</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Select multiple photos for printing or download the entire event album in full resolution (unwatermarked zip).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleSelectAllPhotos} className="btn btn-dark" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  Select All Visible
                </button>
                {selectedPhotos.length > 0 && (
                  <button onClick={handleClearSelection} className="btn btn-dark" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ef4444' }}>
                    Clear Selection
                  </button>
                )}
                <button 
                  onClick={() => triggerBulkDownload('complete')}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                  disabled={bulkDownloading || event.photos.length === 0}
                >
                  Download Complete Album ({event.photos.length})
                </button>
              </div>
            </div>

            {/* Selected batch action bar */}
            {selectedPhotos.length > 0 && (
              <div className="glass-panel animate-pulse-gold" style={{
                position: 'sticky',
                bottom: '20px',
                zIndex: 99,
                padding: '1rem 2rem',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} selected
                </span>
                <button 
                  onClick={() => triggerBulkDownload('selected')}
                  className="btn btn-gold" 
                  style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}
                  disabled={bulkDownloading}
                >
                  <Download size={14} />
                  <span>Download Selected Photos</span>
                </button>
              </div>
            )}

            {bulkDownloading && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <RefreshCw size={36} className="animate-pulse-gold" color="var(--gold-primary)" />
                <h4 style={{ color: 'var(--gold-primary)' }}>Archiving Photos...</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Creating compression package. Please do not close this tab.</p>
              </div>
            )}

            {!bulkDownloading && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {filteredPhotos.map((photo) => {
                  const isSelected = selectedPhotos.includes(photo.id);
                  return (
                    <div 
                      key={photo.id}
                      onClick={() => handleSelectPhoto(photo.id)}
                      style={{
                        position: 'relative',
                        height: '180px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                        opacity: isSelected ? 1 : 0.7,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img src={photo.url} alt="Bulk Selectable" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {/* Check indicator */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--gold-primary)' : 'rgba(0,0,0,0.5)',
                        border: '1.5px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        zIndex: 15
                      }}>
                        {isSelected && <CheckCircle size={16} color="#050505" strokeWidth={3} />}
                      </div>

                      {watermarkEnabled && (
                        <div className="watermark-overlay">
                          <div className="watermark-text" style={{ fontSize: '0.5rem', padding: '0.1rem 0.3rem' }}>
                            WATERMARK
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </section>

      {/* 5. IMAGE PREVIEW MODAL */}
      {previewPhoto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }} onClick={() => setPreviewPhoto(null)}>
          <button 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            onClick={() => setPreviewPhoto(null)}
          >
            ✕ Close
          </button>
          
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '80vh', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <img src={previewPhoto.url} alt="Preview Zoom" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            {watermarkEnabled && (
              <div className="watermark-overlay">
                <div className="watermark-text" style={{ fontSize: '2vw' }}>
                  ANTIGRAVITY STUDIO LIVE
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#fff', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{previewPhoto.category} photo</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Snapped at {previewPhoto.timestamp}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => toggleLikePhoto(event.id, previewPhoto.id)}
                className="btn btn-dark" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Heart size={14} fill={previewPhoto.likedByUser ? "#ef4444" : "none"} color={previewPhoto.likedByUser ? "#ef4444" : "#fff"} />
                <span>Like ({previewPhoto.likes})</span>
              </button>
              <a 
                href={previewPhoto.url} 
                download 
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Download size={14} />
                <span>Download High-Res</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. SHARE PHOTO MODAL */}
      {shareModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setShareModalData(null)}>
          <div className="glass-panel" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)',
            textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>Share Photo</h3>
            <img src={shareModalData.url} alt="To Share" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', marginInline: 'auto', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }} />
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Copy link to share or publish directly on social media:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareModalData.url);
                  addNotification("Link Copied", "Direct photo CDN URL copied to clipboard.", "success");
                  setShareModalData(null);
                }}
                className="btn btn-gold" 
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                Copy Link to Clipboard
              </button>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this photo: ' + shareModalData.url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark" 
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  WhatsApp
                </a>
                <a 
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareModalData.url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark" 
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  Pinterest
                </a>
              </div>
            </div>
            
            <button 
              onClick={() => setShareModalData(null)}
              className="btn btn-outline" 
              style={{ marginTop: '1.5rem', width: '100%', fontSize: '0.75rem', padding: '0.5rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
