import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Bell, Zap, Thermometer, Battery } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function AlertRules() {
  const { t } = useTranslation();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRules() {
      const data = await apiClient.getAlertRules();
      setRules(data);
      setLoading(false);
    }
    loadRules();
  }, []);

  const getSeverityColor = (sev) => {
    return sev === 'critical' ? 'var(--status-red)' : 'var(--status-orange)';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('admin.alertRules')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Automated intelligence to monitor your fleet 24/7.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}>
          <Plus size={18} /> Create Rule
        </button>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div>Loading rules...</div>
        ) : rules.map(rule => (
          <div key={rule.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: rule.active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {rule.sensorType === 'temp' ? <Thermometer size={20} color="var(--accent-primary)" /> : <Zap size={20} color="var(--status-orange)" />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{rule.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Type: {rule.sensorType}</span>
                </div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', background: getSeverityColor(rule.severity), color: 'white', textTransform: 'uppercase' }}>
                {rule.severity}
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${getSeverityColor(rule.severity)}` }}>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                 Trigger when <strong>Value {rule.condition} {rule.threshold}</strong>
               </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <div style={{ position: 'relative', width: '34px', height: '18px', background: rule.active ? 'var(--status-green)' : 'var(--border-color)', borderRadius: '10px', transition: '0.3s' }}>
                    <div style={{ position: 'absolute', top: '2px', left: rule.active ? '18px' : '2px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', transition: '0.3s' }}></div>
                  </div>
                  {rule.active ? 'Active' : 'Disabled'}
               </label>
               <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
