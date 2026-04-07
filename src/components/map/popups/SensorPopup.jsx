import React from 'react';
import { useTranslation } from 'react-i18next';
import BasePopup from './BasePopup';

export default function SensorPopup({ device, schema, onAction, commanding }) {
  const { t } = useTranslation();

  return (
    <BasePopup device={device}>
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' }}>
          {t('dashboard.quickActions')}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(schema.actions || []).map(action => (
            <button 
              key={action.id}
              disabled={commanding === device.devEui}
              onClick={(e) => { e.stopPropagation(); onAction(device.devEui, action.id); }}
              style={{ 
                background: action.variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-primary)', 
                color: action.variant === 'danger' ? '#ef4444' : 'var(--text-primary)', 
                border: `1px solid ${action.variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`, 
                padding: '6px', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontSize: '0.65rem',
                opacity: commanding === device.devEui ? 0.5 : 1
              }}
            >
              {action.icon} {t(action.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </BasePopup>
  );
}
