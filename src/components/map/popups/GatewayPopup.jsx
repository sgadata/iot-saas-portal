import React from 'react';
import { useTranslation } from 'react-i18next';
import BasePopup from './BasePopup';
import { Radio, Activity, Cpu } from 'lucide-react';

export default function GatewayPopup({ device, onAction, commanding }) {
  const { t } = useTranslation();

  return (
    <BasePopup device={device}>
      <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
          <Radio size={16} /> 
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>{t('common.uptime')}: {device.uptime}</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>{t('common.vendor')}:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{device.vendor}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>{t('common.traffic')}:</span>
            <span style={{ color: 'var(--status-green)', fontWeight: '600' }}>{device.traffic}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button 
          onClick={() => onAction(device.devEui, 'REBOOT')}
          disabled={commanding === device.devEui}
          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
        >
          <Activity size={14} /> Reboot
        </button>
        <button 
          onClick={() => {}}
          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
        >
          <Cpu size={14} /> Logs
        </button>
      </div>
    </BasePopup>
  );
}
