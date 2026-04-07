import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, Settings, Bell, LogOut, Globe, PlusSquare, Menu, X, ShieldCheck, ClipboardList, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';


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
            {/* SGA DATA SVG LOGO */}
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z" fill="url(#paint0_linear)" stroke="var(--accent-primary)" strokeWidth="2"/>
              <path d="M30 40H70V60H30V40Z" fill="white" fillOpacity="0.1"/>
              <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
              <path d="M25 30L35 35M25 70L35 65M75 30L65 35M75 70L65 65" stroke="var(--accent-primary)" strokeWidth="2"/>
              <defs>
                <linearGradient id="paint0_linear" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#1e3a8a"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '0.02em' }}>SGA DATA</h2>
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

             <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--status-red)', borderRadius: '50%' }}></span>
             </button>
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
