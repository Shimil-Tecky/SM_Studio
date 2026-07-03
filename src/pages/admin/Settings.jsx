import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Settings as SettingsIcon, Shield, Database, QrCode, Sparkles, Save, Clock, Eye } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, addNotification } = useContext(AppContext);
  const [activePanel, setActivePanel] = useState('general');

  // Form states initialized with context
  const [studioName, setStudioName] = useState(settings.studioName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [twoFactor, setTwoFactor] = useState(settings.twoFactor);
  const [passwordPolicy, setPasswordPolicy] = useState(settings.passwordPolicy);
  const [cloudStorage, setCloudStorage] = useState(settings.cloudStorage);
  const [autoBackup, setAutoBackup] = useState(settings.autoBackup);
  const [qrStyle, setQrStyle] = useState(settings.qrStyle);
  const [aiQuality, setAiQuality] = useState(settings.aiQuality);
  const [autoEditRules, setAutoEditRules] = useState(settings.autoEditRules);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      studioName,
      email,
      phone,
      address,
      twoFactor,
      passwordPolicy,
      cloudStorage,
      autoBackup,
      qrStyle,
      aiQuality,
      autoEditRules
    });
    addNotification("Settings Saved", "System configuration details updated successfully.", "success");
  };

  const loginLogs = [
    { user: "Super Admin (sm_gaming)", ip: "192.168.1.42", location: "New York, USA", time: "Today, 18:20", status: "Success" },
    { user: "Editor (editor)", ip: "192.168.1.75", location: "Brooklyn, USA", time: "Today, 17:45", status: "Success" },
    { user: "Client (Isabella)", ip: "172.56.21.9", location: "Mobile Socket, NYC", time: "Today, 18:31", status: "Success" },
    { user: "Unknown (hack)", ip: "203.0.113.195", location: "Shanghai, CHN", time: "Yesterday, 04:12", status: "Blocked (2FA/Rules)" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            System Administration
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Configuration Desk</h2>
        </div>
        <button onClick={handleSave} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: '2rem'
      }} className="settings-grid">
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 800px) {
            .settings-grid { grid-template-columns: 1fr !important; }
            .settings-sidebar {
              flex-direction: row !important;
              overflow-x: auto !important;
              padding: 0.5rem !important;
            }
            .settings-sidebar button {
              white-space: nowrap !important;
            }
          }
        `}} />

        {/* Left column panel links */}
        <div className="glass-panel settings-sidebar" style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          height: 'fit-content',
          backgroundColor: 'rgba(13,13,13,0.3)'
        }}>
          <button 
            onClick={() => setActivePanel('general')}
            className="btn"
            style={{
              justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', padding: '0.6rem 1rem',
              backgroundColor: activePanel === 'general' ? 'var(--gold-primary)' : 'transparent',
              color: activePanel === 'general' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <SettingsIcon size={14} />
            <span>General Studio Settings</span>
          </button>

          <button 
            onClick={() => setActivePanel('security')}
            className="btn"
            style={{
              justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', padding: '0.6rem 1rem',
              backgroundColor: activePanel === 'security' ? 'var(--gold-primary)' : 'transparent',
              color: activePanel === 'security' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <Shield size={14} />
            <span>Security & 2FA Policies</span>
          </button>

          <button 
            onClick={() => setActivePanel('storage')}
            className="btn"
            style={{
              justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', padding: '0.6rem 1rem',
              backgroundColor: activePanel === 'storage' ? 'var(--gold-primary)' : 'transparent',
              color: activePanel === 'storage' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <Database size={14} />
            <span>Cloud Storage Settings</span>
          </button>

          <button 
            onClick={() => setActivePanel('qr')}
            className="btn"
            style={{
              justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', padding: '0.6rem 1rem',
              backgroundColor: activePanel === 'qr' ? 'var(--gold-primary)' : 'transparent',
              color: activePanel === 'qr' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <QrCode size={14} />
            <span>Event QR Branding</span>
          </button>

          <button 
            onClick={() => setActivePanel('ai')}
            className="btn"
            style={{
              justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', padding: '0.6rem 1rem',
              backgroundColor: activePanel === 'ai' ? 'var(--gold-primary)' : 'transparent',
              color: activePanel === 'ai' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <Sparkles size={14} />
            <span>AI Neural Preferences</span>
          </button>
        </div>

        {/* Right column active panel viewport */}
        <div className="glass-panel" style={{ padding: '2.5rem', backgroundColor: 'rgba(13,13,13,0.2)' }}>
          <form onSubmit={handleSave}>
            
            {/* GENERAL SETTINGS PANEL */}
            {activePanel === 'general' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--gold-primary)' }}>
                  Studio Information
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Studio Name Label</label>
                  <input type="text" value={studioName} onChange={(e) => setStudioName(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Support Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Studio HQ Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" required />
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS PANEL */}
            {activePanel === 'security' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--gold-primary)' }}>
                  Security & Access Policies
                </h3>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="checkbox" 
                      checked={twoFactor} 
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--gold-primary)' }}
                    />
                    <span>Force Two-Factor Authentication (2FA) for Editors</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require SMS / Google Authenticator OTP code on every admin dashboard login session.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Password Policies</label>
                  <select 
                    value={passwordPolicy} 
                    onChange={(e) => setPasswordPolicy(e.target.value)} 
                    className="form-control form-select"
                  >
                    <option value="Strong (Min 8 chars, 1 uppercase, 1 symbol)">Strong (Min 8 chars, 1 uppercase, 1 symbol)</option>
                    <option value="Ultra (Min 12 chars, Numbers, Symbols, 2FA)">Ultra (Min 12 chars, Numbers, Symbols, 2FA)</option>
                    <option value="Standard (Min 6 chars)">Standard (Min 6 chars)</option>
                  </select>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} />
                    <span>Historical Access Login Logs</span>
                  </h4>
                  <div className="table-container">
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr>
                          <th>Admin User</th>
                          <th>IP Address</th>
                          <th>Location</th>
                          <th>Date Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.user}</td>
                            <td><code>{log.ip}</code></td>
                            <td>{log.location}</td>
                            <td>{log.time}</td>
                            <td style={{ color: log.status.startsWith('Success') ? '#10b981' : '#ef4444', fontWeight: '600' }}>{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STORAGE SETTINGS PANEL */}
            {activePanel === 'storage' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--gold-primary)' }}>
                  Cloud Media Storage
                </h3>

                <div className="form-group">
                  <label className="form-label">Primary Cloud Target Provider</label>
                  <select 
                    value={cloudStorage} 
                    onChange={(e) => setCloudStorage(e.target.value)} 
                    className="form-control form-select"
                  >
                    <option value="Google Cloud Storage">Google Cloud Storage (GCS bucket)</option>
                    <option value="Amazon Web Services S3">Amazon Web Services S3 (antigravity-live-bucket)</option>
                    <option value="Firebase Storage">Firebase Realtime Storage Bucket</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="checkbox" 
                      checked={autoBackup} 
                      onChange={(e) => setAutoBackup(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--gold-primary)' }}
                    />
                    <span>Auto-Mirror Backup Storage (Cold Archive)</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automatically trigger serverless function to copy uploaded files to cold-vault storage every 24 hours.</span>
                </div>
              </div>
            )}

            {/* QR SETTINGS PANEL */}
            {activePanel === 'qr' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--gold-primary)' }}>
                  QR Code Styling & Branding
                </h3>

                <div className="form-group">
                  <label className="form-label">QR Generation Canvas Style</label>
                  <select 
                    value={qrStyle} 
                    onChange={(e) => setQrStyle(e.target.value)} 
                    className="form-control form-select"
                  >
                    <option value="Classic Gold (Branded)">Classic Gold Gradient (Centred Logo)</option>
                    <option value="High contrast (Black / White)">High contrast Monochrome (Fast Scan)</option>
                    <option value="Custom Dark Gold (Translucent)">Custom Dark Gold (Translucent backdrop)</option>
                  </select>
                </div>
              </div>
            )}

            {/* AI SETTINGS PANEL */}
            {activePanel === 'ai' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--gold-primary)' }}>
                  AI Neural Engine Preferences
                </h3>

                <div className="form-group">
                  <label className="form-label">Neural Enhancement Render Quality</label>
                  <select 
                    value={aiQuality} 
                    onChange={(e) => setAiQuality(e.target.value)} 
                    className="form-control form-select"
                  >
                    <option value="Ultra HDR (32-bit)">Ultra HDR 32-bit (Slow, High Precision)</option>
                    <option value="Standard HDR (16-bit)">Standard HDR 16-bit (Recommended)</option>
                    <option value="Fast Proxy (8-bit)">Fast Proxy 8-bit (High speed previews)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Auto Enhancer Preset Trigger Rules</label>
                  <select 
                    value={autoEditRules} 
                    onChange={(e) => setAutoEditRules(e.target.value)} 
                    className="form-control form-select"
                  >
                    <option value="Auto-Color & Light Skin Soften">Auto Color & Skin Softening (Wedding Presets)</option>
                    <option value="Face Sharpen Only">Face Sharpening Only (Close-ups)</option>
                    <option value="Disabled (Manual processing required)">None / Manual Processing Only</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-gold" style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={16} />
              <span>Save Changes</span>
            </button>
            
          </form>
        </div>

      </div>

    </div>
  );
}
