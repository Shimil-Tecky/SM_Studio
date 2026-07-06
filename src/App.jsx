import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import NotificationCenter from './components/NotificationCenter';

// Public Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Events from './pages/Events';
import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import AdminLogin from './pages/AdminLogin';

// Admin Shell & Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagement from './pages/admin/EventManagement';
import LiveSharing from './pages/admin/LiveSharing';
import AiPhotoEditing from './pages/admin/AiPhotoEditing';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import Settings from './pages/admin/Settings';
import ContentManagement from './pages/admin/ContentManagement';
import PortfolioManagement from './pages/admin/PortfolioManagement';

function GlobalBackground() {
  const { settings } = useContext(AppContext);
  const bgImg = settings?.backgroundImage || '/hero_background.png';
  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        backgroundImage: `url(${bgImg})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'rgba(5, 5, 5, 0.85)', // rich glass black mask overlay
        pointerEvents: 'none'
      }}></div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GlobalBackground />
        {/* Global Floating Notification center */}
        <NotificationCenter />
        
        {/* Universal Luxury Navigation Header */}
        <Navbar />
        
        {/* Route Definitions */}
        <Routes>
          {/* Public portals */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/events" element={<Events />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Nested Administrator Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="live-sharing" element={<LiveSharing />} />
            <Route path="ai-editing" element={<AiPhotoEditing />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="portfolio" element={<PortfolioManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
