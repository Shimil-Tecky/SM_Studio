import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Briefcase, Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, 
  Upload, Save, X, ShieldAlert, Sparkles, Image as ImageIcon, CheckCircle 
} from 'lucide-react';

const PRESETS = [
  { name: 'Bridal Portrait', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
  { name: 'Ceremony Vows', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600' },
  { name: 'Couple Promenade', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600' },
  { name: 'Table Decoration', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Family Portrait', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rehearsal Gala', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600' }
];

export default function PortfolioManagement() {
  const { 
    user, portfolioItems, addPortfolioItem, updatePortfolioItem, 
    deletePortfolioItem, reorderPortfolioItems, addNotification 
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Editor / Add Form states
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('Wedding');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [gallery, setGallery] = useState([]); // List of image urls
  const [status, setStatus] = useState('Published');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Check permissions
  const isAuthorized = user && (user.role === 'Super Admin' || user.role === 'Editor');

  if (!isAuthorized) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '1.5rem', animation: 'pulseGold 2s infinite' }} />
        <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Your security role <b>({user?.role || 'Guest'})</b> does not have permissions to manage portfolio projects. Please log in as a Super Admin or Editor.
        </p>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCat('Wedding');
    setDescription('');
    setCoverUrl('');
    setGallery([]);
    setStatus('Published');
    setNewGalleryUrl('');
    setIsEditing(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCat(item.cat);
    setDescription(item.description);
    setCoverUrl(item.url);
    setGallery(item.gallery || []);
    setStatus(item.status || 'Published');
    setNewGalleryUrl('');
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !coverUrl.trim()) {
      addNotification("Validation Error", "Please fill in all required fields (Title and Cover Image URL).", "warning");
      return;
    }

    const itemData = {
      title,
      cat,
      description,
      url: coverUrl,
      gallery,
      status
    };

    if (editingId) {
      updatePortfolioItem(editingId, itemData);
      addNotification("Project Updated", `Portfolio item "${title}" has been successfully updated.`, "success");
    } else {
      addPortfolioItem(itemData);
      addNotification("Project Created", `Portfolio item "${title}" has been successfully created.`, "success");
    }
    setIsEditing(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the portfolio item "${name}"?`)) {
      deletePortfolioItem(id);
      addNotification("Project Deleted", "Portfolio project deleted.", "warning");
    }
  };

  const toggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Published' ? 'Hidden' : 'Published';
    updatePortfolioItem(id, { status: nextStatus });
    addNotification("Status Updated", `Project visibility is now set to ${nextStatus}.`, "success");
  };

  // Reordering helpers
  const moveUp = (idx) => {
    if (idx === 0) return;
    reorderPortfolioItems(idx, idx - 1);
  };

  const moveDown = (idx) => {
    if (idx === portfolioItems.length - 1) return;
    reorderPortfolioItems(idx, idx + 1);
  };

  // Upload simulation
  const handleUploadCoverFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gallery file drop / upload
  const handleAddGalleryFile = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setGallery(prev => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeGalleryImage = (idx) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setGallery(prev => [...prev, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Portfolios
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Portfolio Editor</h2>
        </div>
        
        {!isEditing && (
          <button 
            onClick={openAddModal}
            className="btn btn-gold" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Add Portfolio Project</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit or Add Project form */
        <form onSubmit={handleSave} className="glass-panel animate-fade-in" style={{ padding: '2.5rem', backgroundColor: 'rgba(10,10,10,0.6)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--gold-primary)" />
              <span>{editingId ? "Edit Showcase Project" : "Create New Portfolio Project"}</span>
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-dark" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-gold" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
              >
                <Save size={14} />
                <span>Save Project</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="charts-row">
            
            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Wedding Vance"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="form-control form-select"
                    required
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Ceremony">Ceremony</option>
                    <option value="Reception">Reception</option>
                    <option value="Family">Family</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Publish Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-control form-select"
                  >
                    <option value="Published">Published (Visible on site)</option>
                    <option value="Hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the story of the project, venue, styling, and captures..."
                  className="form-control"
                />
              </div>

              {/* Cover Image Input */}
              <div className="form-group">
                <label className="form-label">Cover Image URL *</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Enter image URL or upload file..."
                    className="form-control"
                    style={{ flex: 1 }}
                    required
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
                    <Upload size={14} color="var(--gold-primary)" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadCoverFile}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {/* Cover Presets */}
                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Or select a premium stock preset:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {PRESETS.map((p, idx) => (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => setCoverUrl(p.url)}
                        style={{
                          fontSize: '0.7rem',
                          background: coverUrl === p.url ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                          border: coverUrl === p.url ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
                          color: '#fff',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Image Gallery (Multiple Uploads) */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Project Image Gallery (Upload Multiple Images)</span>
                
                {/* Gallery image adding */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Enter gallery image URL to append..."
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addGalleryUrl} className="btn btn-dark" style={{ padding: '0.65rem 1rem', fontSize: '0.8rem' }}>Add URL</button>
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
                    <Upload size={14} color="var(--gold-primary)" />
                    <span>Upload Files</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleAddGalleryFile}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Gallery thumbnails grid */}
                {gallery.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '1rem'
                  }}>
                    {gallery.map((url, idx) => (
                      <div key={idx} style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        height: '90px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => removeGalleryImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '2rem',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                    No additional images inside project gallery yet. Add URLs or drag & drop image files.
                  </div>
                )}
              </div>

            </div>

            {/* Visual Thumbnail Column */}
            <div>
              <span className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Cover Image Preview</span>
              {coverUrl ? (
                <div style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--gold-primary)',
                  boxShadow: 'var(--gold-glow)',
                  height: '220px',
                  backgroundColor: '#000',
                  position: 'relative'
                }}>
                  <img src={coverUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'var(--gold-primary)',
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '700'
                  }}>
                    {cat}
                  </span>
                </div>
              ) : (
                <div style={{
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-lg)',
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <ImageIcon size={32} />
                  <span>No Cover Selected</span>
                </div>
              )}
            </div>

          </div>
        </form>
      ) : (
        /* Main Project list and ordering interface */
        <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'rgba(10,10,10,0.3)', border: '1px solid var(--border-color)' }}>
          <div className="table-container">
            <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Reorder</th>
                  <th>Image</th>
                  <th>Project Details</th>
                  <th>Category</th>
                  <th>Gallery</th>
                  <th>Status</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolioItems.map((item, idx) => (
                  <tr key={item.id} className="animate-fade-in" style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    opacity: item.status === 'Hidden' ? 0.65 : 1
                  }}>
                    {/* Reordering Controls */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === 0 ? 'var(--text-muted)' : 'var(--gold-primary)',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1
                          }}
                          title="Move Project Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => moveDown(idx)}
                          disabled={idx === portfolioItems.length - 1}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === portfolioItems.length - 1 ? 'var(--text-muted)' : 'var(--gold-primary)',
                            cursor: idx === portfolioItems.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === portfolioItems.length - 1 ? 0.3 : 1
                          }}
                          title="Move Project Down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td>
                      <div style={{
                        width: '70px',
                        height: '50px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}>
                        <img src={item.url} alt="Project thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>

                    {/* Project details */}
                    <td>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '600' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {item.description || 'No description provided.'}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--gold-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {item.cat}
                      </span>
                    </td>

                    {/* Gallery Images Count */}
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.gallery ? item.gallery.length : 0} images
                      </span>
                    </td>

                    {/* Visibility status */}
                    <td>
                      <button 
                        onClick={() => toggleStatus(item.id, item.status || 'Published')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: (item.status || 'Published') === 'Published' ? '#10b981' : '#f59e0b'
                        }}
                        title="Toggle visibility"
                      >
                        {(item.status || 'Published') === 'Published' ? (
                          <>
                            <Eye size={14} />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="btn btn-dark" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Edit Project Details"
                        >
                          <Edit size={12} color="var(--gold-primary)" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.title)}
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(220,38,38,0.2)' }}
                          title="Delete Project"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {portfolioItems.length === 0 && (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              No projects found in the signature showcase yet. Click "Add Portfolio Project" to begin.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
