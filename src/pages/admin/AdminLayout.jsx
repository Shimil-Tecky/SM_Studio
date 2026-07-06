import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import AdminSidebar from '../../components/AdminSidebar';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!user || (user.role !== 'Super Admin' && user.role !== 'Event Admin' && user.role !== 'Editor' && user.role !== 'Employee')) {
      navigate('/admin-login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <ShieldAlert size={60} color="var(--gold-primary)" style={{ marginBottom: '1.5rem' }} />
        <h2>Verifying Credentials...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You are being redirected to the login panel.</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '90vh',
      background: 'transparent',
      color: '#fff',
      padding: '2rem 1.5rem 5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem'
      }} className="admin-layout-container">
        
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 991px) {
            .admin-layout-container {
              flex-direction: column !important;
            }
            .admin-main-content {
              width: 100% !important;
            }
          }
        `}} />

        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Dynamic Admin Sub-Page Content */}
        <main className="admin-main-content" style={{
          flex: 1,
          width: 'calc(100% - 280px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
}
