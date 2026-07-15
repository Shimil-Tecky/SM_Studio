import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UploadCloud, 
  Sparkles, 
  Users, 
  Settings as SettingsIcon,
  ShieldAlert,
  FileText,
  Briefcase,
  Edit,
  UserCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const { user, updateUserProfile } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editLoginUsername, setEditLoginUsername] = useState(user?.loginUsername || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editDob, setEditDob] = useState(user?.dob || '');
  const [editAvatarStyle, setEditAvatarStyle] = useState(user?.avatarStyle || 'Circle');
  const [editPassword, setEditPassword] = useState(user?.password || '');

  const handleOpenModal = () => {
    setEditUsername(user?.username || '');
    setEditLoginUsername(user?.loginUsername || '');
    setEditAvatar(user?.avatar || '');
    setEditDob(user?.dob || '');
    setEditAvatarStyle(user?.avatarStyle || 'Circle');
    setEditPassword(user?.password || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [mouseDownOnBackdrop, setMouseDownOnBackdrop] = useState(false);

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      setMouseDownOnBackdrop(true);
    } else {
      setMouseDownOnBackdrop(false);
    }
  };

  const handleBackdropMouseUp = (e) => {
    if (e.target === e.currentTarget && mouseDownOnBackdrop) {
      setIsModalOpen(false);
    }
    setMouseDownOnBackdrop(false);
  };

  const getAvatarStyle = (styleName, isPreview = false) => {
    const size = isPreview ? '40px' : '48px';
    const baseStyle = {
      width: size,
      height: size,
      objectFit: 'cover',
      border: '2px solid var(--gold-primary)',
      transition: 'var(--transition-smooth)'
    };
    
    switch (styleName) {
      case 'Rounded Square':
        return { ...baseStyle, borderRadius: '8px' };
      case 'Hexagon':
        return { 
          ...baseStyle, 
          borderRadius: '0%', 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        };
      case 'Border Glow':
        return { ...baseStyle, borderRadius: '50%', boxShadow: '0 0 10px var(--gold-primary)' };
      case 'Circle':
      default:
        return { ...baseStyle, borderRadius: '50%' };
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Event Management', path: '/admin/events', icon: CalendarDays },
    { name: 'Website Content', path: '/admin/content', icon: FileText, restricted: ['Employee', 'Event Admin'] },
    { name: 'Portfolio Editor', path: '/admin/portfolio', icon: Briefcase, restricted: ['Employee', 'Event Admin'] },
    { name: 'Live Sharing', path: '/admin/live-sharing', icon: UploadCloud },
    { name: 'AI Photo Editing', path: '/admin/ai-editing', icon: Sparkles },
    { name: 'Employees', path: '/admin/employees', icon: Users, restricted: ['Editor', 'Employee', 'Event Admin'] },
    { name: 'Client Requests', path: '/admin/requests', icon: UserCheck, restricted: ['Employee', 'Editor'] },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon }
  ];

  return (
    <>
      <aside className="glass-panel" style={{
        width: '260px',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        height: 'fit-content',
        position: 'sticky',
        top: '100px',
        backgroundColor: 'rgba(13, 13, 13, 0.4)'
      }} className="admin-sidebar">
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 991px) {
            .admin-sidebar {
              width: 100% !important;
              position: relative !important;
              top: 0 !important;
              flex-direction: row !important;
              overflow-x: auto !important;
              padding: 1rem !important;
              gap: 1rem !important;
            }
            .admin-sidebar-header { display: none !important; }
            .admin-sidebar-nav {
              flex-direction: row !important;
              width: 100% !important;
            }
            .admin-sidebar-link {
              padding: 0.5rem 1rem !important;
              font-size: 0.8rem !important;
              white-space: nowrap !important;
            }
          }
        `}} />

        {/* Admin User Profile Header */}
        <div 
          className="admin-sidebar-header profile-edit-trigger" 
          onClick={handleOpenModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .profile-edit-trigger {
              transition: var(--transition-smooth);
            }
            .profile-edit-trigger:hover {
              opacity: 0.9;
            }
            .profile-edit-trigger:hover .profile-edit-badge {
              opacity: 1 !important;
            }
          `}} />
          <div style={{ position: 'relative' }}>
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
              alt="Admin Profile" 
              style={getAvatarStyle(user?.avatarStyle || 'Circle', false)}
            />
            <div className="profile-edit-badge" style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: 'var(--gold-primary)',
              color: 'var(--bg-deep)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--gold-glow)',
              opacity: 0,
              transition: 'var(--transition-smooth)'
            }}>
              <Edit size={10} strokeWidth={3} />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{user?.username || 'Admin'}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        {/* Nav Menu */}
        <nav className="admin-sidebar-nav" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isRestricted = item.restricted && item.restricted.includes(user?.role);
            
            if (isRestricted) {
              return (
                <div 
                  key={idx} 
                  title="Restricted Access"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-muted)',
                    cursor: 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    opacity: 0.5
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>{item.name}</span>
                </div>
              );
            }

            return (
              <NavLink 
                key={idx}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `admin-sidebar-link btn`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textTransform: 'none',
                  letterSpacing: 'normal',
                  backgroundColor: isActive ? 'var(--gold-primary)' : 'transparent',
                  color: isActive ? 'var(--bg-deep)' : 'var(--text-secondary)',
                  border: 'none',
                  boxShadow: isActive ? 'var(--gold-glow)' : 'none'
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999, // extremely high z-index to overlay dashboards and SVGs
            padding: '1rem',
            cursor: 'default'
          }}
          onMouseDown={handleBackdropMouseDown}
          onMouseUp={handleBackdropMouseUp}
        >
          <div style={{
            maxWidth: '460px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.75rem',
            boxShadow: 'var(--gold-glow-intense)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            color: '#fff',
            textAlign: 'left'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Edit Admin Profile</h3>
              <div style={{ width: '40px', height: '1.5px', backgroundColor: 'var(--gold-primary)', margin: '0.5rem auto 0' }}></div>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateUserProfile(editUsername, editAvatar, editDob, editAvatarStyle, editPassword, editLoginUsername);
              setIsModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Full Name</label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)} 
                  className="form-control" 
                  required 
                  placeholder="Admin full name"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Login Username</label>
                <input 
                  type="text" 
                  value={editLoginUsername} 
                  onChange={(e) => setEditLoginUsername(e.target.value)} 
                  className="form-control" 
                  required 
                  placeholder="Username (used for logging in)"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Date of Birth (DOB)</label>
                <input 
                  type="date" 
                  value={editDob} 
                  onChange={(e) => setEditDob(e.target.value)} 
                  className="form-control" 
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Profile Image</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.25rem 0' }}>
                  <label className="btn btn-outline" style={{
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    margin: 0,
                    borderColor: 'rgba(212,175,55,0.4)',
                    backgroundColor: 'rgba(212,175,55,0.02)'
                  }}>
                    <UploadCloud size={14} color="var(--gold-primary)" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Or enter image URL:</span>
                </div>
                <input 
                  type="url" 
                  value={editAvatar} 
                  onChange={(e) => setEditAvatar(e.target.value)} 
                  className="form-control" 
                  placeholder="https://unsplash.com/..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Avatar Style</label>
                <select 
                  value={editAvatarStyle} 
                  onChange={(e) => setEditAvatarStyle(e.target.value)} 
                  className="form-control form-select"
                >
                  <option value="Circle">Circle (Classic)</option>
                  <option value="Rounded Square">Rounded Square (Modern)</option>
                  <option value="Hexagon">Hexagon (Creative)</option>
                  <option value="Border Glow">Border Glow (Premium)</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Position / Role</label>
                <input 
                  type="text" 
                  value={user?.role || 'Super Admin'} 
                  className="form-control" 
                  disabled 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-muted)',
                    cursor: 'not-allowed',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role assignment cannot be changed by employees.</span>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: 0 }}>Change Password</label>
                <input 
                  type="password" 
                  value={editPassword} 
                  onChange={(e) => setEditPassword(e.target.value)} 
                  className="form-control" 
                  placeholder="New password (optional)"
                />
              </div>
              
              {/* Preview Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img 
                  src={editAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                  alt="Avatar Preview" 
                  style={getAvatarStyle(editAvatarStyle, true)}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avatar Preview ({editAvatarStyle})</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-outline" 
                  style={{ flex: 1, textTransform: 'none', letterSpacing: 'normal' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-gold" 
                  style={{ flex: 1, textTransform: 'none', letterSpacing: 'normal' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
