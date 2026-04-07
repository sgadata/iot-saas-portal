import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Bell, Zap, Thermometer, Battery, X, Mail, MessageSquare, Play, Droplets, Flame, Sun, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function AlertRules() {
  const { t } = useTranslation();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({ 
    name: '', 
    sensorType: 'temp', 
    condition: '>', 
    threshold: 30, 
    severity: 'warning',
    channels: { email: false, telegram: false },
    action: 'none'
  });

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

  const getSensorIcon = (type) => {
    switch(type) {
      case 'water': return <Droplets size={20} color="var(--accent-primary)" />;
      case 'gas': return <Flame size={20} color="var(--status-red)" />;
      case 'temp': return <Thermometer size={20} color="var(--status-orange)" />;
      case 'light': return <Sun size={20} color="#fbbf24" />;
      case 'valve': return <Settings size={20} color="var(--status-green)" />;
      default: return <Zap size={20} color="var(--text-secondary)" />;
    }
  };

  const handleCreateRule = (e) => {
      e.preventDefault();
      const ruleToAdd = { ...newRule, id: rules.length + 1, active: true };
      setRules([ruleToAdd, ...rules]);
      setShowModal(false);
      setNewRule({ 
        name: '', 
        sensorType: 'temp', 
        condition: '>', 
        threshold: 30, 
        severity: 'warning',
        channels: { email: false, telegram: false },
        action: 'none'
      });
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
          <div key={rule.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: rule.active ? 1 : 0.6, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {getSensorIcon(rule.sensorType)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{rule.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{rule.sensorType}</span>
                </div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', background: getSeverityColor(rule.severity), color: 'white', textTransform: 'uppercase' }}>
                {rule.severity}
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${getSeverityColor(rule.severity)}` }}>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                 {t('admin.triggerWhen')} <strong>{rule.condition} {rule.threshold}</strong>
               </p>
            </div>

            {/* Rule Features Badge */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
               {rule.channels?.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}><Mail size={12} /> Email</div>}
               {rule.channels?.telegram && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}><MessageSquare size={12} /> Telegram</div>}
               {rule.action && rule.action !== 'none' && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                   <Play size={12} /> {t(`admin.action${rule.action.charAt(0).toUpperCase() + rule.action.slice(1)}`)}
                 </div>
               )}
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)' }}>
              <div className="card" style={{ width: '100%', maxWidth: '550px', animation: 'scale-up 0.2s ease-out', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('admin.createRuleBtn')}</h3>
                      <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <X size={24} />
                      </button>
                  </div>

                  <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('admin.ruleName')}</label>
                            <input required type="text" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none' }} placeholder="Ex: High Temp Alert" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('admin.severity')}</label>
                            <select value={newRule.severity} onChange={e => setNewRule({...newRule, severity: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none' }}>
                                <option value="warning">{t('admin.sevWarning')}</option>
                                <option value="critical">{t('admin.sevCritical')}</option>
                            </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('provisioning.type')}</label>
                            <select value={newRule.sensorType} onChange={e => setNewRule({...newRule, sensorType: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}>
                                <option value="water">{t('types.water')}</option>
                                <option value="gas">{t('types.gas')}</option>
                                <option value="temp">{t('types.temp')}</option>
                                <option value="light">{t('types.light')}</option>
                                <option value="valve">{t('types.valve')}</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('admin.condition')}</label>
                            <select value={newRule.condition} onChange={e => setNewRule({...newRule, condition: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}>
                                <option value=">">{t('admin.condGreater')}</option>
                                <option value="<">{t('admin.condLess')}</option>
                                <option value="=">{t('admin.condEquals')}</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('admin.threshold')}</label>
                            <input required type="number" value={newRule.threshold} onChange={e => setNewRule({...newRule, threshold: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} />
                        </div>
                      </div>

                      {/* Phase 3: Channels */}
                      <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{t('admin.notificationChannels')}</label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={newRule.channels.email} onChange={e => setNewRule({...newRule, channels: {...newRule.channels, email: e.target.checked}})} /> {t('admin.channelEmail')}
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={newRule.channels.telegram} onChange={e => setNewRule({...newRule, channels: {...newRule.channels, telegram: e.target.checked}})} /> {t('admin.channelTelegram')}
                          </label>
                        </div>
                      </div>

                      {/* Phase 4: Automated Action */}
                      <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{t('admin.automatedAction')}</label>
                        <select 
                          value={newRule.action} 
                          onChange={e => setNewRule({...newRule, action: e.target.value})}
                          style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }}
                        >
                          <option value="none">{t('admin.noAction')}</option>
                          <option value="CloseValve">{t('admin.actionCloseValve')}</option>
                          <option value="Reset">{t('admin.actionReset')}</option>
                          <option value="Sync">{t('admin.actionSync')}</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowModal(false)}
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          {t('common.clearAll')}
                        </button>
                        <button 
                          type="submit" 
                          style={{ background: 'var(--accent-primary)', color: 'white', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            {t('admin.createRuleBtn')}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
