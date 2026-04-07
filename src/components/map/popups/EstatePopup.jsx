import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ArrowRight } from 'lucide-react';

export default function EstatePopup({ estate }) {
  const { t } = useTranslation();

  return (
    <div style={{ minWidth: '180px', padding: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '6px', borderRadius: '8px' }}>
          <Building2 size={18} color="var(--accent-primary)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('dashboard.kpiEstates')}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{estate.name}</span>
        </div>
      </div>

      <div style={{ background: 'rgba(35, 134, 54, 0.05)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(35, 134, 54, 0.2)', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('map.status')}:</span>
            <span style={{ color: 'var(--status-green)', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('map.normal')}</span>
        </div>
      </div>

      <button 
        style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        {t('dashboard.viewMapBtn')} <ArrowRight size={14} />
      </button>
    </div>
  );
}
