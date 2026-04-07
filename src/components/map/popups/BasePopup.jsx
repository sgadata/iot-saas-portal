import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function BasePopup({ device, children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch(status) {
      case 'green': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'var(--status-green)', text: 'var(--status-green)', icon: '✅' };
      case 'orange': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--status-orange)', text: 'var(--status-orange)', icon: '⚠️' };
      case 'red': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--status-red)', text: 'var(--status-red)', icon: '⚠️' };
      default: return { bg: 'rgba(255,255,255,0.05)', border: 'var(--border-color)', text: 'var(--text-secondary)', icon: 'ℹ️' };
    }
  };

  const style = getStatusStyle(device.status);

  return (
    <div style={{ padding: '4px', minWidth: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{device.name}</h4>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: device.valveStatus === 'open' ? 'var(--status-green)' : 'var(--border-color)' }}></div>
      </div>
      
      <p style={{ margin: '0 0 12px 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
        {t(`types.${device.type}`)} | EUI: {device.devEui.slice(-4)}
      </p>

      {/* Status Badge */}
      <div style={{ 
        padding: '10px', 
        background: style.bg, 
        borderRadius: '6px', 
        fontSize: '0.8rem', 
        marginBottom: '12px', 
        border: `1px solid ${style.border}`,
        color: style.text,
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {style.icon} {device.status === 'green' ? 'OK' : (device.statusDetail || 'Alert detected')}
      </div>

      {children}

      <button 
        onClick={() => navigate(`/telemetry/${device.devEui}`)}
        style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '6px 0', fontSize: '0.75rem', cursor: 'pointer', width: '100%', marginTop: '8px', textAlign: 'center' }}
      >
        {t('map.viewTelemetryBtn')} →
      </button>
    </div>
  );
}
