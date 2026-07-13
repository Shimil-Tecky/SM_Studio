import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import NotificationCenter from './components/NotificationCenter';

// Public Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Events from './pages/Events';
import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import GuestLogin from './pages/GuestLogin';
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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
          <Route path="/guest-login" element={<GuestLogin />} />
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
