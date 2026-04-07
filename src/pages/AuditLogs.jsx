import React, { useState, useEffect } from 'react';
import { ClipboardList, User, Calendar, Tag, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function AuditLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadLogs() {
      const data = await apiClient.getAuditLogs();
      setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('admin.auditLogs')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Security tracking and historical user actions.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Time</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Action</th>
                <th style={{ padding: '1rem' }}>Target Device</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading logs...</td></tr>
              ) : filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} /> {log.time}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                      <User size={14} color="var(--accent-primary)" /> {log.user}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    <Tag size={14} style={{ marginRight: '6px' }} />
                    {log.target}
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
