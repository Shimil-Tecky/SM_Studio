import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  CalendarDays, Camera, Video, Users, Eye, Database, 
  ArrowUpRight, Clock, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function AdminDashboard() {
  const { events, employees, settings, activityLogs } = useContext(AppContext);

  // Derive stats
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'Active').length;
  
  let totalPhotos = 0;
  let totalVideos = 0;
  let activeViewers = 0;
  events.forEach(evt => {
    totalPhotos += evt.photos?.length || 0;
    totalVideos += evt.videos?.length || 0;
    if (evt.status === 'Active') {
      activeViewers += evt.activeClients || 0;
    }
  });

  const totalEmployees = employees.length;

  // Chart Mock Data
  const dailyUploadsData = [
    { name: 'Mon', Photos: 40, Videos: 4 },
    { name: 'Tue', Photos: 72, Videos: 8 },
    { name: 'Wed', Photos: 110, Videos: 12 },
    { name: 'Thu', Photos: 85, Videos: 10 },
    { name: 'Fri', Photos: 210, Videos: 15 },
    { name: 'Sat', Photos: 450, Videos: 32 },
    { name: 'Sun', Photos: 380, Videos: 24 }
  ];

  const trafficData = [
    { time: '12:00', Guests: 12 },
    { time: '14:00', Guests: 45 },
    { time: '16:00', Guests: 88 },
    { time: '18:00', Guests: 145 },
    { time: '20:00', Guests: 210 },
    { time: '22:00', Guests: 160 }
  ];

  const storageData = [
    { name: 'Photos', value: 340, color: 'var(--gold-primary)' },
    { name: 'Videos', value: 680, color: 'var(--gold-secondary)' },
    { name: 'Backups', value: 120, color: 'rgba(255, 255, 255, 0.15)' }
  ];

  const getLogIcon = (tag) => {
    switch (tag) {
      case 'System':
        return Database;
      case 'Live Sharing':
        return Eye;
      case 'CMS Content':
      case 'CMS':
        return Sparkles;
      case 'Portfolio':
        return Camera;
      case 'Staff Scheduling':
      case 'Employee':
        return Users;
      default:
        return Database;
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const diffMs = new Date() - new Date(ts.replace(' ', 'T'));
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return ts;
    } catch (e) {
      return ts;
    }
  };

  const recentActivities = (activityLogs || []).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            System Core
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Studio Overview</h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} />
          <span>Sync Status: Live (Firebase Sim)</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Events</span>
            <CalendarDays size={20} color="var(--gold-primary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{totalEvents}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gold-primary)', marginTop: '0.5rem' }}>
            <span>{activeEvents} Active Now</span>
            <span style={{ color: 'var(--text-muted)' }}>+2 this month</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Online Viewers</span>
            <Eye size={20} color="var(--gold-primary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{activeViewers}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>
            <span>Live Guest Sockets</span>
            <span>+15% peak</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Uploaded Media</span>
            <Camera size={20} color="var(--gold-primary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{totalPhotos + totalVideos}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <span>{totalPhotos} Photos</span>
            <span>{totalVideos} Videos</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Team Roster</span>
            <Users size={20} color="var(--gold-primary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{totalEmployees}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <span>Photographers & Editors</span>
            <span>4 Active Attendance</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }} className="charts-row">
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 991px) {
            .charts-row { grid-template-columns: 1fr !important; }
          }
        `}} />

        {/* Daily Upload Area Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.2)', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Daily Media Uploads Volume
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={dailyUploadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPhotos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--gold-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="Photos" stroke="var(--gold-primary)" fillOpacity={1} fill="url(#colorPhotos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Pie Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.2)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Storage Breakdown (1.14 TB)
          </h3>
          <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', fontSize: '0.8rem' }}>
            {storageData.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }}></span>
                  <span>{s.name}</span>
                </div>
                <span style={{ fontWeight: '600' }}>{s.value} GB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Event Traffic & Recent Log Activities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }} className="charts-row">
        
        {/* Hourly Traffic Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.2)', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Peak Guest Activity (Today)
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid var(--border-color)' }} />
                <Bar dataKey="Guests" fill="var(--gold-secondary)" radius={[4, 4, 0, 0]}>
                  {trafficData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 4 ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.4)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.2)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            System Activity Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((act, idx) => {
                const Icon = getLogIcon(act.tag);
                return (
                  <div key={act.id || idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.8rem',
                    borderBottom: idx !== recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        padding: '0.4rem',
                        borderRadius: '8px',
                        color: 'var(--gold-primary)'
                      }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#fff' }}>{act.action}</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {formatTime(act.timestamp)} {act.user ? `by ${act.user}` : ''}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}>
                      {act.tag}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No recent activities logged yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
