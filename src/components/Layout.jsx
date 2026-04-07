import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, Settings, Bell, LogOut, Globe, PlusSquare, Menu, X, ShieldCheck, ClipboardList, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';


export default function Layout() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'tecnico'] },
    { key: 'liveMap', path: '/map', icon: <Map size={20} />, roles: ['admin', 'tecnico'] },
    { key: 'telemetry', path: '/telemetry', icon: <Activity size={20} />, roles: ['admin', 'tecnico'] },
    { key: 'provisioning', name: 'Add Sensor', path: '/provisioning', icon: <PlusSquare size={20} />, roles: ['admin', 'tecnico'], requiresProvisioning: true } 
  ].filter(item => {
    const hasRole = item.roles.includes(user?.role || '');
    if (item.requiresProvisioning) {
      return hasRole && user?.canProvision;
    }
    return hasRole;
  });

  const adminItems = [
    { key: 'alertRules', path: '/rules', icon: <ShieldCheck size={20} />, roles: ['admin'] },
    { key: 'auditLogs', path: '/audit', icon: <ClipboardList size={20} />, roles: ['admin'] },
    { key: 'settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      // Simulamos que las notificaciones vienen de las alertas críticas actuales
      const fleet = await apiClient.getDeviceFleet();
      const alerts = fleet.filter(d => d.status !== 'green').map(d => ({
        id: d.devEui,
        title: d.name,
        msg: d.statusDetail,
        time: d.lastSeen,
        severity: d.status
      }));
      setNotifications(alerts);
    };
    loadNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'visible' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="logo.png" 
              alt="SGA Data Logo" 
              style={{ height: '55px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '850', color: 'white', margin: 0, letterSpacing: '0.05em' }}>SGA DATA</h2>
              <span style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', marginTop: '-2px' }}>IoT Commander</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-only"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none' }} 
            id="close-menu-btn"
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.key} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? '500' : '400'
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                  {item.icon}
                </span>
                {t(`menu.${item.key}`)}
              </Link>
            )
          })}

          {adminItems.length > 0 && (
            <>
              <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', padding: '0 14px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('menu.administration')}
              </div>
              {adminItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.key} 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                      transition: 'all 0.2s',
                      fontWeight: isActive ? '500' : '400'
                    }}
                  >
                    <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                      {item.icon}
                    </span>
                    {t(`menu.${item.key}`)}
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginRight: '1rem', display: 'none' }}
            className="mobile-only"
            id="mobile-menu-toggle"
          >
            <Menu size={24} />
          </button>
          
          <h1 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t('app.adminPortal')}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
             
             {/* Componente Selector de Banderas (Idiomas) */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: 'var(--radius-md)' }}>
               <button onClick={() => i18n.changeLanguage('es')} style={{ background: i18n.language === 'es' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', filter: i18n.language === 'es' ? 'none' : 'grayscale(100%)', transition: 'all 0.2s' }} title="Español">
                 🇪🇸
               </button>
               <button onClick={() => i18n.changeLanguage('en')} style={{ background: i18n.language === 'en' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', filter: i18n.language === 'en' ? 'none' : 'grayscale(100%)', transition: 'all 0.2s' }} title="English">
                 🇬🇧
               </button>
             </div>

             <div style={{ position: 'relative' }}>
               <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
                  id="notif-bell-btn"
               >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: 'var(--status-red)', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }}></span>
                  )}
               </button>

               {/* Notifications Dropdown */}
               {isNotificationsOpen && (
                 <div style={{ 
                    position: 'absolute', 
                    top: '40px', 
                    right: '-10px', 
                    width: '320px', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-lg)', 
                    boxShadow: 'var(--shadow-card)',
                    zIndex: 1001,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease-out'
                 }}>
                   <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                     <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700' }}>{t('dashboard.alerts')}</h4>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>{notifications.length} {t('common.pending')}</span>
                   </div>
                   <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                     {notifications.length === 0 ? (
                       <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                         <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🎉</div>
                         {t('common.noAlerts')}
                       </div>
                     ) : (
                       notifications.map(n => (
                         <div 
                           key={n.id} 
                           style={{ 
                             padding: '12px 16px', 
                             borderBottom: '1px solid rgba(255,255,255,0.05)', 
                             display: 'flex', 
                             flexDirection: 'column', 
                             gap: '4px',
                             transition: 'background 0.2s',
                             cursor: 'default'
                           }}
                           onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                           onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                         >
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                             <span style={{ fontSize: '0.825rem', fontWeight: '700', color: n.severity === 'red' ? 'var(--status-red)' : 'var(--status-orange)' }}>
                               {n.severity === 'red' ? '🔴' : '🟠'} {n.title}
                             </span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }} 
                               style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px' }}
                               title="Archive"
                             >
                               ✕
                             </button>
                           </div>
                           <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{n.msg}</p>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>🕒 {n.time}</span>
                             <Link to={`/telemetry/${n.id}`} onClick={() => setIsNotificationsOpen(false)} style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                               Ver más →
                             </Link>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                   {notifications.length > 0 && (
                     <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                       <button onClick={() => setNotifications([])} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                         {t('common.clearAll')}
                       </button>
                     </div>
                   )}
                 </div>
               )}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Log out">
                  <LogOut size={18} />
                </button>
             </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
