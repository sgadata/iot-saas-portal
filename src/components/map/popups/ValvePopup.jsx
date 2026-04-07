import React from 'react';
import { useTranslation } from 'react-i18next';
import BasePopup from './BasePopup';

export default function ValvePopup({ device, onCommand, commanding }) {
  const { t } = useTranslation();

  return (
    <BasePopup device={device}>
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {t('telemetry.valve_status')}: <span style={{ color: device.valveStatus === 'open' ? 'var(--status-green)' : 'var(--text-primary)' }}>{t(`telemetry.${device.valveStatus}`)}</span>
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button 
            disabled={commanding === device.devEui || device.valveStatus === 'open'}
            onClick={() => onCommand(device.devEui, 'OPEN')}
            style={{ 
              background: device.valveStatus === 'open' ? 'var(--bg-primary)' : 'var(--status-green)', 
              color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', 
              opacity: (commanding === device.devEui || device.valveStatus === 'open') ? 0.5 : 1 
            }}
          >
            {commanding === device.devEui ? t('telemetry.sending') : t('telemetry.btn_open')}
          </button>
          <button 
            disabled={commanding === device.devEui || device.valveStatus === 'closed'}
            onClick={() => onCommand(device.devEui, 'CLOSE')}
            style={{ 
              background: 'var(--status-red)', 
              color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', 
              opacity: (commanding === device.devEui || device.valveStatus === 'closed') ? 0.5 : 1 
            }}
          >
            {t('telemetry.btn_close')}
          </button>
        </div>

        <button 
          disabled={commanding === device.devEui}
          onClick={() => onCommand(device.devEui, 'OPEN', 30)}
          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
        >
          {t('telemetry.btn_timer')}
        </button>
      </div>
    </BasePopup>
  );
}
