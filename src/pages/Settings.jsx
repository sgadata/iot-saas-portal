import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Shield, User as UserIcon, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

export default function Settings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'tecnico' });

  useEffect(() => {
    async function loadData() {
      const data = await apiClient.getUsers();
      setUsers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleInvite = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      ...formData,
      status: 'pending'
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'tecnico' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}
        >
          <Plus size={18} /> {t('settings.inviteBtn')}
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>{t('settings.matrixTitle')}</h3>
        
        {loading ? <p style={{ color: 'var(--text-secondary)' }}>{t('admin.loading')}</p> : (
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
                        backgroundColor: u.role === 'admin' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: u.role === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        fontWeight: '700'
                      }}>
                        {u.role === 'admin' ? t('settings.roleAdmin') : t('settings.roleTech')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.status === 'active' ? 'var(--status-green)' : u.status === 'pending' ? 'var(--status-orange)' : 'var(--text-secondary)' }}></div>
                        <span style={{ fontSize: '0.875rem' }}>{u.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--status-red)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', width: '450px', padding: '2rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '700' }}>{t('settings.inviteTitle')}</h3>
            <p style={{ margin: '0 0 2rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.inviteSub')}</p>
            
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{t('settings.formName')}</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{t('settings.formEmail')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{t('settings.formRole')}</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                  >
                    <option value="admin">{t('settings.roleAdmin')}</option>
                    <option value="tecnico">{t('settings.roleTech')}</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{ marginTop: '1rem', background: 'var(--accent-primary)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                {t('settings.sendInvite')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
