import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  FileText, Save, Eye, ShieldAlert, Sparkles, Image as ImageIcon, 
  HelpCircle, CheckCircle, RefreshCw, Upload, Heading, List, User 
} from 'lucide-react';

const PRESETS = [
  { name: 'Luxury Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
  { name: 'Elegant Ceremony', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800' },
  { name: 'Classic Couple', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800' },
  { name: 'Camera Lens Detail', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
  { name: 'Studio Thoughts Lens', url: '/studio_thoughts.png' },
  { name: 'Romantic Hero', url: '/hero_background.png' }
];

export default function ContentManagement() {
  const { user, cmsContent, updateCmsContent, addNotification } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'services' | 'philosophy' | 'testimonials' | 'contact'
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['hero', 'services', 'philosophy', 'testimonials', 'contact'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Check Permissions
  const isAuthorized = user && (user.role === 'Super Admin' || user.role === 'Editor');

  // Form State initialized from Context
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(cmsContent)));

  if (!isAuthorized) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '1.5rem', animation: 'pulseGold 2s infinite' }} />
        <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Your current security role <b>({user?.role || 'Guest'})</b> does not have permissions to modify live website content. Please log in as a Super Admin or Editor.
        </p>
      </div>
    );
  }

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleServiceChange = (idx, field, value) => {
    setFormData(prev => {
      const newList = [...prev.services.list];
      newList[idx] = { ...newList[idx], [field]: value };
      return {
        ...prev,
        services: {
          ...prev.services,
          list: newList
        }
      };
    });
  };

  const handleTestimonialChange = (idx, field, value) => {
    setFormData(prev => {
      const newList = [...prev.testimonials.list];
      newList[idx] = { ...newList[idx], [field]: value };
      return {
        ...prev,
        testimonials: {
          ...prev.testimonials,
          list: newList
        }
      };
    });
  };

  const saveSection = (section) => {
    updateCmsContent(section, formData[section]);
    addNotification("Changes Saved", `Homepage "${section}" section successfully updated and synchronized live!`, "success");
  };

  // Drag and drop base64 image loader
  const handleImageFileDrop = (e, section, field) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange(section, field, event.target.result);
        addNotification("Image Loaded", `Selected local file "${file.name}" ready to publish.`, "info");
      };
      reader.readAsDataURL(file);
    }
  };

  // Rich Text Markup helper (bold, italic, list wrap)
  const insertTextMarkup = (section, field, marker) => {
    const textarea = document.getElementById(`${section}-${field}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement = '';
    if (marker === 'bold') replacement = `<b>${selectedText || 'bold text'}</b>`;
    else if (marker === 'italic') replacement = `<i>${selectedText || 'italic text'}</i>`;
    else if (marker === 'quote') replacement = `"${selectedText || 'inspiring quote'}"`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    handleInputChange(section, field, newText);

    // Refocus & select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length + 2, start + marker.length + 2 + (selectedText || 'text').length);
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            System CMS
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Website Content Manager</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="btn btn-dark" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Eye size={16} />
            <span>{previewMode ? "Exit Preview" : "Visual Preview"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        {['hero', 'services', 'philosophy', 'testimonials', 'contact'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPreviewMode(false);
            }}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              border: activeTab === tab ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === tab ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.02)',
              color: activeTab === tab ? 'var(--gold-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              letterSpacing: '0.5px',
              transition: 'var(--transition-fast)'
            }}
            className="nav-bubble"
          >
            {tab} Section
          </button>
        ))}
      </div>

      {previewMode ? (
        /* Visual Preview Panel */
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', backgroundColor: '#070707', border: '1px dashed var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '700', textTransform: 'uppercase' }}>
              ✨ Real-Time visual layout simulator
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This is how the section will appear on the live index page</span>
          </div>

          {activeTab === 'hero' && (
            <div style={{
              backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.9) 100%), url(${formData.hero.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '5rem 2rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <h2 className="font-logo" style={{ fontSize: '1.25rem', letterSpacing: '4px', color: 'var(--gold-primary)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                {formData.hero.title}
              </h2>
              <h3 className="font-serif" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.5rem' }}>
                {formData.hero.subtitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
                {formData.hero.desc}
              </p>
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{formData.services.tagline}</span>
              <h3 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.5rem', marginBottom: '2.5rem' }}>{formData.services.heading}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                {formData.services.list.map((srv, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--gold-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{srv.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', padding: '2rem 0' }}>
              <div>
                <img 
                  src={formData.philosophy.image} 
                  alt="Philosophy Preset" 
                  style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)', aspectRatio: '4/3', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{formData.philosophy.tagline}</span>
                <h3 className="font-serif" style={{ fontSize: '2rem', color: '#fff', margin: '0.5rem 0 1.5rem' }}>{formData.philosophy.heading}</h3>
                <p style={{ color: '#fff', fontStyle: 'italic', marginBottom: '1rem', borderLeft: '2px solid var(--gold-primary)', paddingLeft: '1rem' }}>
                  {formData.philosophy.quote}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{formData.philosophy.paragraph1}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>{formData.philosophy.paragraph2}</p>
                <div>
                  <h5 style={{ color: '#fff', fontSize: '0.95rem' }}>{formData.philosophy.author}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>{formData.philosophy.location}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div style={{ padding: '2rem 1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{formData.testimonials.tagline}</span>
              <h3 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.5rem', marginBottom: '3rem' }}>{formData.testimonials.heading}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                {formData.testimonials.list.map((t, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '2rem', flex: '1 1 300px', maxWidth: '400px', backgroundColor: 'rgba(10,10,10,0.3)', textAlign: 'left' }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t.text}</p>
                    <h5 style={{ color: '#fff' }}>{t.author}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{t.tagline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', textAlign: 'left' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>{formData.contact.tagline}</span>
                <h3 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{formData.contact.heading}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{formData.contact.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <div>📞 Phone: <b>{formData.contact.phone}</b></div>
                  <div>✉️ Email: <b>{formData.contact.email}</b></div>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'rgba(13,13,13,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Consultation Request</h4>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ height: '35px', background: 'var(--gold-gradient)', borderRadius: '4px', opacity: 0.3 }} />
              </div>
            </div>
          )}

        </div>
      ) : (
        /* CMS Forms Panel */
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem 2.2rem', backgroundColor: 'rgba(10,10,10,0.6)', border: '1px solid var(--border-color)' }}>
          
          {/* Active section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--gold-primary)" />
              <span>Editing: {activeTab.toUpperCase()} Section Details</span>
            </h3>
            <button 
              onClick={() => saveSection(activeTab)}
              className="btn btn-gold" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Save size={16} />
              <span>Publish Changes</span>
            </button>
          </div>

          {/* Form Content depending on active tab */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Hero Title / Brand name</label>
                <input 
                  type="text" 
                  value={formData.hero.title}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Heading / Main Statement</label>
                <input 
                  type="text" 
                  value={formData.hero.subtitle}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">Hero Description Paragraph</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <button type="button" onClick={() => insertTextMarkup('hero', 'desc', 'bold')} className="btn btn-dark" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>B</button>
                    <button type="button" onClick={() => insertTextMarkup('hero', 'desc', 'italic')} className="btn btn-dark" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>I</button>
                  </div>
                </div>
                <textarea 
                  id="hero-desc"
                  rows={4}
                  value={formData.hero.desc}
                  onChange={(e) => handleInputChange('hero', 'desc', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Backdrop image path / URL</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={formData.hero.bgImage}
                    onChange={(e) => handleInputChange('hero', 'bgImage', e.target.value)}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  {/* File Upload simulator (converting to base64) */}
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
                      onChange={(e) => handleImageFileDrop(e, 'hero', 'bgImage')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {/* Presets Grid */}
                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Or choose from studio presets:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {PRESETS.map((p, idx) => (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('hero', 'bgImage', p.url)}
                        style={{
                          fontSize: '0.7rem',
                          background: formData.hero.bgImage === p.url ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                          border: formData.hero.bgImage === p.url ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
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
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Services Section Tagline</label>
                  <input 
                    type="text" 
                    value={formData.services.tagline}
                    onChange={(e) => handleInputChange('services', 'tagline', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Services Heading</label>
                  <input 
                    type="text" 
                    value={formData.services.heading}
                    onChange={(e) => handleInputChange('services', 'heading', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* List of services */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Individual Service Details (6 items)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formData.services.list.map((srv, idx) => (
                    <div key={idx} className="glass-card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(212,175,55,0.1)' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Service {idx+1} Title</label>
                        <input 
                          type="text" 
                          value={srv.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Service {idx+1} Description</label>
                        <input 
                          type="text" 
                          value={srv.desc}
                          onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Philosophy Section Tagline</label>
                  <input 
                    type="text" 
                    value={formData.philosophy.tagline}
                    onChange={(e) => handleInputChange('philosophy', 'tagline', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Philosophy Heading</label>
                  <input 
                    type="text" 
                    value={formData.philosophy.heading}
                    onChange={(e) => handleInputChange('philosophy', 'heading', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">Editorial Quote Text</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <button type="button" onClick={() => insertTextMarkup('philosophy', 'quote', 'bold')} className="btn btn-dark" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>B</button>
                    <button type="button" onClick={() => insertTextMarkup('philosophy', 'quote', 'italic')} className="btn btn-dark" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>I</button>
                  </div>
                </div>
                <textarea 
                  id="philosophy-quote"
                  rows={3}
                  value={formData.philosophy.quote}
                  onChange={(e) => handleInputChange('philosophy', 'quote', e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Philosophy Paragraph 1</label>
                  <textarea 
                    rows={4}
                    value={formData.philosophy.paragraph1}
                    onChange={(e) => handleInputChange('philosophy', 'paragraph1', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Philosophy Paragraph 2</label>
                  <textarea 
                    rows={4}
                    value={formData.philosophy.paragraph2}
                    onChange={(e) => handleInputChange('philosophy', 'paragraph2', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input 
                    type="text" 
                    value={formData.philosophy.author}
                    onChange={(e) => handleInputChange('philosophy', 'author', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Locations / Capes</label>
                  <input 
                    type="text" 
                    value={formData.philosophy.location}
                    onChange={(e) => handleInputChange('philosophy', 'location', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Artistic Showcase Image URL / Path</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={formData.philosophy.image}
                    onChange={(e) => handleInputChange('philosophy', 'image', e.target.value)}
                    className="form-control"
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
                    <Upload size={14} color="var(--gold-primary)" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageFileDrop(e, 'philosophy', 'image')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Testimonials Section Tagline</label>
                  <input 
                    type="text" 
                    value={formData.testimonials.tagline}
                    onChange={(e) => handleInputChange('testimonials', 'tagline', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Testimonials Heading</label>
                  <input 
                    type="text" 
                    value={formData.testimonials.heading}
                    onChange={(e) => handleInputChange('testimonials', 'heading', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* List of testimonials */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Individual Testimonials Details (2 items)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {formData.testimonials.list.map((t, idx) => (
                    <div key={idx} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(212,175,55,0.1)', padding: '1.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Testimonial {idx+1} Author</label>
                        <input 
                          type="text" 
                          value={t.author}
                          onChange={(e) => handleTestimonialChange(idx, 'author', e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Testimonial {idx+1} Role Tagline</label>
                        <input 
                          type="text" 
                          value={t.tagline}
                          onChange={(e) => handleTestimonialChange(idx, 'tagline', e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Testimonial {idx+1} Text Content</label>
                        <textarea 
                          rows={3}
                          value={t.text}
                          onChange={(e) => handleTestimonialChange(idx, 'text', e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Contact Section Tagline</label>
                  <input 
                    type="text" 
                    value={formData.contact.tagline}
                    onChange={(e) => handleInputChange('contact', 'tagline', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Heading</label>
                  <input 
                    type="text" 
                    value={formData.contact.heading}
                    onChange={(e) => handleInputChange('contact', 'heading', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Section Description</label>
                <textarea 
                  rows={3}
                  value={formData.contact.desc}
                  onChange={(e) => handleInputChange('contact', 'desc', e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Studio Reservations Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Studio Reservations Email Address</label>
                  <input 
                    type="email" 
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
