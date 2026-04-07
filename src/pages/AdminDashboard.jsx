import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Droplets, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ totalEstates: 0, activeSensors: 0, criticalAlerts: 0 });
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 2000));
    const csvContent = "data:text/csv;charset=utf-8,ID,Metric,Value\n1,Flow,120\n2,Temp,22";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SGA_Monthly_Report.csv");
    document.body.appendChild(link);
    link.click();
    setExporting(false);
  };

  useEffect(() => {
    async function loadMetrics() {
        const m = await apiClient.getGlobalMetrics();
        if (m) setMetrics(m);
    }
    loadMetrics();
  }, []);

  const kpis = [
    { title: t('dashboard.kpiEstates'), value: metrics.totalEstates, icon: <Users size={24} color="var(--accent-primary)" /> },
    { title: t('dashboard.kpiSensors'), value: metrics.activeSensors, icon: <Activity size={24} color="var(--status-green)" /> },
    { title: t('dashboard.kpiAlerts'), value: metrics.criticalAlerts, icon: <AlertTriangle size={24} color="var(--status-red)" /> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Area */}
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('dashboard.overview')}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.welcome')}</p>
          <button 
            onClick={handleExport}
            disabled={exporting}
            style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--accent-primary)', 
              border: '1px solid var(--accent-primary)', 
              padding: '8px 16px', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            {exporting ? t('admin.generating') : `📊 ${t('admin.exportBtn')}`}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title">{kpi.title}</div>
              <div className="card-value">{kpi.value}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Alerts & Quick Actions */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>{t('dashboard.recentAlerts')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { time: '10 mins ago', message: 'Abnormal water flow detected at Estate Alpha', type: 'critical' },
              { time: '2 hours ago', message: 'Sensor B4 low battery (15%)', type: 'warning' },
            ].map((alert, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', marginTop: '6px', background: alert.type === 'critical' ? 'var(--status-red)' : 'var(--status-orange)' }}></div>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{alert.message}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>{t('dashboard.quickActions')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/map')}
              style={{ width: '100%', padding: '1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}>
              {t('dashboard.viewMapBtn')}
            </button>
            <button 
              onClick={() => navigate('/telemetry/1')}
              style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '500', transition: 'border-color 0.2s' }}>
              {t('dashboard.diagnoseBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
