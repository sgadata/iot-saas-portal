import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Cpu, Key, MapPin, Tag, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

export default function Provisioning() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [estates, setEstates] = useState([]);
  const [form, setForm] = useState({ devEui: '', appKey: '', type: 'water', estateId: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    async function loadEstatesForDropdown() {
      const e = await apiClient.getTopologies();
      setEstates(e);
      if(e.length > 0) setForm(curr => ({ ...curr, estateId: e[0].id }));
    }
    loadEstatesForDropdown();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones de Seguridad (Regex estricto)
    const euiRegex = /^[0-9A-F]{16}$/;
    const keyRegex = /^[0-9A-F]{32}$/;

    if (!euiRegex.test(form.devEui)) {
      alert("Invalid DevEUI: Must be 16 hexadecimal characters.");
      return;
    }

    if (form.appKey && !keyRegex.test(form.appKey)) {
      alert("Invalid AppKey: Must be 32 hexadecimal characters.");
      return;
    }

    setStatus('loading');
    const response = await apiClient.registerLoRaDevice(form.devEui, form.appKey, form.type, form.estateId);
    if(response.success) {
        setStatus('success');
        setTimeout(() => {
            setStatus('idle');
            setForm({ devEui: '', appKey: '', type: 'water', estateId: estates[0]?.id || '' });
        }, 3000);
    }
  };

  if (!user?.canProvision) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('provisioning.title')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t('provisioning.subtitle')}</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {status === 'success' ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '1rem', color: 'var(--status-green)' }}>
               <CheckCircle size={64} />
               <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('provisioning.success')}</h3>
            </div>
        ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* DEV EUI */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('provisioning.devEui')}</label>
                <div style={{ position: 'relative' }}>
                  <Cpu size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input 
                    type="text" 
                    placeholder="A84041000181XXXX"
                    maxLength={16}
                    required
                    value={form.devEui}
                    onChange={(e) => setForm({...form, devEui: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t('provisioning.devEuiSub')}</p>
              </div>

               {/* APP KEY */}
               <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('provisioning.appKey')}</label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input 
                    type="text" 
                    placeholder="2B7E151628AED2A6ABF7158809CF4F3C"
                    required
                    value={form.appKey}
                    onChange={(e) => setForm({...form, appKey: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', letterSpacing: '1px' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t('provisioning.appKeySub')}</p>
              </div>

              {/* TIPO CLASE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('provisioning.type')}</label>
                    <div style={{ position: 'relative' }}>
                      <Tag size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }} />
                      <select 
                        value={form.type}
                        onChange={(e) => setForm({...form, type: e.target.value})}
                        style={{ width: '100%', appearance: 'none', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}
                      >
                         <option value="water">{t('types.water')}</option>
                         <option value="gas">{t('types.gas')}</option>
                         <option value="light">{t('types.light')}</option>
                         <option value="temp">{t('types.temp')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('provisioning.estate')}</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }} />
                      <select 
                        value={form.estateId}
                        onChange={(e) => setForm({...form, estateId: e.target.value})}
                        style={{ width: '100%', appearance: 'none', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}
                      >
                         {estates.map(e => (
                             <option key={e.id} value={e.id}>{e.name}</option>
                         ))}
                      </select>
                    </div>
                  </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem', textAlign: 'right' }}>
                 <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  style={{ 
                    padding: '0.75rem 2rem', 
                    backgroundColor: 'var(--accent-primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-md)', 
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    opacity: status === 'loading' ? 0.7 : 1
                  }}>
                    {status === 'loading' ? t('provisioning.placing') : t('provisioning.submit')}
                 </button>
              </div>

            </form>
        )}
      </div>
    </div>
  );
}
