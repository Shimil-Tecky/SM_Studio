import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UploadCloud, Camera, Check, RefreshCw, Layers, AlertCircle, ChevronDown } from 'lucide-react';

export default function LiveSharing() {
  const { events, addPhotosToEvent, addVideoToEvent, addNotification } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');

  const standardCategories = [
    { value: 'Bride', label: 'Bride Portraits' },
    { value: 'Groom', label: 'Groom Portraits' },
    { value: 'Ceremony', label: 'Ceremony Altar' },
    { value: 'Reception', label: 'Reception Dinner' },
    { value: 'Family', label: 'Family Groups' }
  ];

  useEffect(() => {
    const eventIdParam = searchParams.get('id');
    if (eventIdParam && events.some(e => e.id === eventIdParam)) {
      setSelectedEventId(eventIdParam);
    }
  }, [searchParams, events]);
  const [category, setCategory] = useState('Ceremony');
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('Ceremony Altar');
  const [mediaType, setMediaType] = useState('photo'); // photo or video

  const handleComboboxChange = (val) => {
    setComboboxSearch(val);
    const matched = standardCategories.find(c => c.label.toLowerCase() === val.trim().toLowerCase());
    if (matched) {
      setCategory(matched.value);
    } else {
      setCategory(val);
    }
  };
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('1:30');
  
  // Simulation States
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const activeEvent = events.find(e => e.id === selectedEventId);

  // Mock list of luxury photos to pull from during simulation uploads
  const mockStockPhotos = [
    "https://images.unsplash.com/photo-1519225495810-7517c300ea07?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800"
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      handleActualFilesUpload(files);
    }
  };

  const handleActualFilesUpload = (files) => {
    if (!selectedEventId) {
      addNotification("Upload Error", "Please select an event first.", "warning");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(files.length);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      if (progress >= 95) {
        clearInterval(interval);
      } else {
        setUploadProgress(progress);
      }
    }, 100);

    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const videoFiles = files.filter(f => f.type.startsWith('video/'));

    const imagePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    const videoPromises = videoFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ name: file.name, data: e.target.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all([Promise.all(imagePromises), Promise.all(videoPromises)])
      .then(([images, videos]) => {
        setUploadProgress(100);
        
        if (images.length > 0) {
          addPhotosToEvent(selectedEventId, images, category);
        }

        videos.forEach(video => {
          addVideoToEvent(selectedEventId, video.name, video.data, '1:15');
        });

        setTimeout(() => {
          setUploading(false);
          addNotification("Upload Complete", `Successfully uploaded ${files.length} file(s) live!`, "success");
        }, 500);
      })
      .catch(err => {
        setUploading(false);
        addNotification("Upload Failed", "Error processing local files.", "danger");
      });
  };

  const handleFileSelectChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleActualFilesUpload(files);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById('media-uploader-input')?.click();
  };

  const simulateBulkUpload = (count) => {
    if (!selectedEventId) {
      addNotification("Upload Error", "Please select an event first.", "warning");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(count);

    // Simulate progress counting from 0 to 100
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete upload by adding mock photos to context
          const urlsToUpload = [];
          for (let i = 0; i < count; i++) {
            const randomPhotoUrl = mockStockPhotos[Math.floor(Math.random() * mockStockPhotos.length)] + `&random=${Date.now() + i}`;
            urlsToUpload.push(randomPhotoUrl);
          }

          if (mediaType === 'photo') {
            addPhotosToEvent(selectedEventId, urlsToUpload, category);
          } else {
            const title = videoTitle.trim() || `Cinematic Teaser #${activeEvent.videos.length + 1}`;
            const mockVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-hands-of-groom-putting-wedding-ring-on-bride-41618-large.mp4";
            addVideoToEvent(selectedEventId, title, mockVideoUrl, videoDuration);
          }

          setUploading(false);
          setVideoTitle('');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const simulateCameraCapture = () => {
    if (!selectedEventId) {
      addNotification("Capture Error", "Please select an event first.", "warning");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(1);

    setTimeout(() => {
      setUploadProgress(50);
      setTimeout(() => {
        const captureUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" + `&capture=${Date.now()}`;
        addPhotosToEvent(selectedEventId, [captureUrl], category);
        setUploading(false);
        setUploadProgress(100);
      }, 500);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Live Stream Broadcasting
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Live Sharing Desk</h2>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        gap: '2rem'
      }} className="sharing-grid">
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 850px) {
            .sharing-grid { grid-template-columns: 1fr !important; }
          }
        `}} />

        {/* Configurations Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              Broadcast Target
            </h3>

            <div className="form-group">
              <label className="form-label">Active Event</label>
              <select 
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="form-control form-select"
              >
                <option value="" disabled>Select event to broadcast to</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.status})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Media Format</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setMediaType('photo')}
                  className="btn"
                  style={{
                    flex: 1,
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                    backgroundColor: mediaType === 'photo' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                    color: mediaType === 'photo' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  Photo Uploads
                </button>
                <button 
                  onClick={() => setMediaType('video')}
                  className="btn"
                  style={{
                    flex: 1,
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                    backgroundColor: mediaType === 'video' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                    color: mediaType === 'video' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  Cinematic Videos
                </button>
              </div>
            </div>

            {mediaType === 'photo' ? (
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Gallery Category Tag</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type="text" 
                    value={comboboxSearch} 
                    onChange={(e) => handleComboboxChange(e.target.value)}
                    onFocus={() => setIsComboboxOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsComboboxOpen(false), 200);
                    }}
                    placeholder="Type custom or select tag..."
                    className="form-control"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsComboboxOpen(!isComboboxOpen);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    <ChevronDown size={18} style={{ transform: isComboboxOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                </div>

                {isComboboxOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    backgroundColor: 'rgba(15, 15, 15, 0.98)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}>
                    {comboboxSearch.trim() && !standardCategories.some(c => c.label.toLowerCase() === comboboxSearch.trim().toLowerCase()) && (
                      <div 
                        onMouseDown={() => {
                          setCategory(comboboxSearch);
                          setIsComboboxOpen(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          color: 'var(--gold-light)',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        className="combobox-item-custom"
                      >
                        <span style={{ color: 'var(--gold-primary)' }}>+</span> Use Custom Tag: "{comboboxSearch}"
                      </div>
                    )}
                    
                    {(
                      comboboxSearch === (standardCategories.find(c => c.value === category)?.label || category)
                        ? standardCategories
                        : standardCategories.filter(item => item.label.toLowerCase().includes(comboboxSearch.toLowerCase()))
                    ).map((item) => (
                      <div 
                        key={item.value}
                        onMouseDown={() => {
                          setCategory(item.value);
                          setComboboxSearch(item.label);
                          setIsComboboxOpen(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          color: category === item.value ? 'var(--gold-primary)' : 'var(--text-secondary)',
                          backgroundColor: category === item.value ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        className="combobox-item"
                      >
                        {item.label}
                      </div>
                    ))}
                    
                    {(
                      comboboxSearch === (standardCategories.find(c => c.value === category)?.label || category)
                        ? standardCategories
                        : standardCategories.filter(item => item.label.toLowerCase().includes(comboboxSearch.toLowerCase()))
                    ).length === 0 && !(comboboxSearch.trim() && !standardCategories.some(c => c.label.toLowerCase() === comboboxSearch.trim().toLowerCase())) && (
                      <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                        No categories found. Type a custom tag!
                      </div>
                    )}
                  </div>
                )}
                
                <style dangerouslySetInnerHTML={{__html: `
                  .combobox-item:hover {
                    background-color: rgba(212, 175, 55, 0.1) !important;
                    color: #fff !important;
                  }
                  .combobox-item-custom:hover {
                    background-color: rgba(212, 175, 55, 0.15) !important;
                    color: #fff !important;
                  }
                `}} />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Cinematic Video Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Wedding Highlight Teaser" 
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2:15" 
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            )}

            {activeEvent && (
              <div className="glass-card" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(212, 175, 55, 0.02)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <span style={{ color: activeEvent.status === 'Active' ? '#ef4444' : 'var(--text-secondary)', fontWeight: '600' }}>
                    {activeEvent.status === 'Active' ? '🔴 Live Broadcasting' : 'Offline'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Photos:</span>
                  <span>{activeEvent.photos?.length || 0}</span>
                </div>
                {activeEvent.status !== 'Active' && (
                  <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', fontSize: '0.75rem', marginTop: '0.25rem', alignItems: 'center' }}>
                    <AlertCircle size={12} />
                    <span>Change status to <b>Active</b> in Event Management for live client updates.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upload Terminal Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Drag & Drop Terminal */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="glass-panel" 
            style={{
              padding: '4rem 2rem',
              backgroundColor: dragging ? 'rgba(212, 175, 55, 0.08)' : 'rgba(13,13,13,0.3)',
              border: dragging ? '2px dashed var(--gold-primary)' : '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={triggerFileSelect}
          >
            <input 
              type="file" 
              id="media-uploader-input" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileSelectChange} 
              style={{ display: 'none' }} 
            />
            <UploadCloud size={60} color={dragging ? "var(--gold-primary)" : "var(--text-secondary)"} strokeWidth={1.5} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>
              Drag & Drop files here, or click to browse
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem', maxWidth: '360px' }}>
              Supports JPG, PNG, MP4. Media will instantly sync with the client's guest galleries.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-gold" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); simulateBulkUpload(6); }}>
                Bulk Upload Simulation (6 files)
              </button>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); simulateCameraCapture(); }}>
                <Camera size={14} />
                <span>Simulate Camera Upload</span>
              </button>
            </div>
          </div>

          {/* Upload Progress Loader (Visible when uploading) */}
          {uploading && (
            <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem 2rem', backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid var(--gold-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={14} className="animate-pulse-gold" color="var(--gold-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Uploading {uploadedCount} file{uploadedCount > 1 ? 's' : ''} to Cloud Storage...</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: '700' }}>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--gold-gradient)', transition: 'width 0.15s ease' }}></div>
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'left' }}>
                Simulating WebSocket broadcast: syncing client gallery sockets...
              </span>
            </div>
          )}

          {/* Success checklist preview */}
          {!uploading && uploadProgress === 100 && (
            <div className="glass-panel animate-fade-in" style={{ padding: '1rem 2rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
                <Check size={18} strokeWidth={3} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Broadcast completed successfully! Sockets updated.</span>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
