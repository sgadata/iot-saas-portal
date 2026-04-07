import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Bell, Zap, Thermometer, Battery, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function AlertRules() {
  const { t } = useTranslation();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', sensorType: 'temp', condition: '>', threshold: 30, severity: 'warning' });

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

  const handleCreateRule = (e) => {
      e.preventDefault();
      const ruleToAdd = { ...newRule, id: rules.length + 1, active: true };
      setRules([ruleToAdd, ...rules]);
      setShowModal(false);
      setNewRule({ name: '', sensorType: 'temp', condition: '>', threshold: 30, severity: 'warning' });
  };

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('admin.alertRules')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('admin.alertRulesSubtitle')}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}>
          <Plus size={18} /> {t('admin.createRuleBtn')}
        </button>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div>{t('admin.loading')}</div>
        ) : rules.map(rule => (
          <div key={rule.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: rule.active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {rule.sensorType === 'temp' ? <Thermometer size={20} color="var(--accent-primary)" /> : <Zap size={20} color="var(--status-orange)" />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{rule.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('telemetry.type')}: {rule.sensorType}</span>
                </div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', background: getSeverityColor(rule.severity), color: 'white', textTransform: 'uppercase' }}>
                {rule.severity}
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${getSeverityColor(rule.severity)}` }}>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                 {t('admin.triggerWhen')} <strong>{t('admin.value')} {rule.condition} {rule.threshold}</strong>
               </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
               <label 
                onClick={() => toggleRule(rule.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <div style={{ position: 'relative', width: '34px', height: '18px', background: rule.active ? 'var(--status-green)' : 'var(--border-color)', borderRadius: '10px', transition: '0.3s' }}>
                    <div style={{ position: 'absolute', top: '2px', left: rule.active ? '18px' : '2px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', transition: '0.3s' }}></div>
                  </div>
                  {rule.active ? t('admin.activeLabel') : t('admin.disabledLabel')}
               </label>
               <button 
                  onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE RULE MODAL */}
      {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
              <div className="card" style={{ width: '100%', maxWidth: '500px', animation: 'scale-up 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{t('admin.createRuleBtn')}</h3>
                      <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <X size={24} />
                      </button>
                  </div>

                  <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>{t('admin.ruleName')}</label>
                          <input 
                            required 
                            type="text" 
                            className="input-field" 
                            value={newRule.name} 
                            onChange={e => setNewRule({...newRule, name: e.target.value})} 
                            style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                          />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>{t('admin.condition')}</label>
                            <select 
                                value={newRule.condition} 
                                onChange={e => setNewRule({...newRule, condition: e.target.value})} 
                                style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                            >
                                <option value=">">Grater than ({'>'})</option>
                                <option value="<">Less than ({'<'})</option>
                                <option value="=">Equals (=)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>{t('admin.threshold')}</label>
                            <input 
                                required 
                                type="number" 
                                value={newRule.threshold} 
                                onChange={e => setNewRule({...newRule, threshold: e.target.value})} 
                                style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                            />
                        </div>
                      </div>

                      <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>{t('admin.severity')}</label>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                  <input type="radio" checked={newRule.severity === 'warning'} onChange={() => setNewRule({...newRule, severity: 'warning'})} /> Warning
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                  <input type="radio" checked={newRule.severity === 'critical'} onChange={() => setNewRule({...newRule, severity: 'critical'})} /> Critical
                              </label>
                          </div>
                      </div>

                      <button type="submit" style={{ background: 'var(--accent-primary)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}>
                          Save Intelligent Rule
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
