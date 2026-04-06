import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState([
    { id: 1, name: 'SGA Admin', role: 'System Admin', email: 'admin@sga.com', status: 'Active' },
    { id: 2, name: 'Carlos Tech', role: 'Technician', email: 'tecnico@sga.com', status: 'Active' },
    { id: 3, name: 'Building Omega Rep', role: 'Client', email: 'omega@client.com', status: 'Pending' },
  ]);

  if (user?.role !== 'admin') {
    return (
      <div className="animate-fade-in card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--status-red)' }}>{t('settings.denied')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t('settings.deniedSub')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('settings.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('settings.subtitle')}</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}>
          <Plus size={18} /> {t('settings.inviteBtn')}
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>{t('settings.matrixTitle')}</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem 0' }}>{t('settings.colName')}</th>
                <th style={{ padding: '1rem 0' }}>{t('settings.colEmail')}</th>
                <th style={{ padding: '1rem 0' }}>{t('settings.colRole')}</th>
                <th style={{ padding: '1rem 0' }}>{t('settings.colStatus')}</th>
                <th style={{ padding: '1rem 0', textAlign: 'right' }}>{t('settings.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '1rem 0' }}>
                     <span style={{ 
                       padding: '4px 8px', 
                       borderRadius: '4px', 
                       fontSize: '0.75rem', 
                       backgroundColor: u.role === 'System Admin' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                       color: u.role === 'System Admin' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                     }}>
                       {u.role}
                     </span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.status === 'Active' ? 'var(--status-green)' : 'var(--status-orange)' }}></div>
                       <span style={{ fontSize: '0.875rem' }}>{u.status}</span>
                     </div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--status-red)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
