import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, Battery, Signal, Droplet, Flame, Thermometer, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';

export default function DeviceTelemetry() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [telemetry, setTelemetry] = useState({ type: 'water', data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTelemetry() {
       const result = await apiClient.getTelemetry(deviceId);
       setTelemetry(result); // result tiene { type: 'gas', data: [...] }
       setLoading(false);
    }
    loadTelemetry();
  }, [deviceId]);

  const getDynamicLayout = () => {
    switch(telemetry.type) {
      case 'gas': return { icon: <Flame size={24} color="#f97316" />, color: 'rgba(249, 115, 22, 0.1)' };
      case 'temp': return { icon: <Thermometer size={24} color="#ec4899" />, color: 'rgba(236, 72, 153, 0.1)' };
      case 'light': return { icon: <Sun size={24} color="#eab308" />, color: 'rgba(234, 179, 8, 0.1)' };
      default: return { icon: <Droplet size={24} color="var(--accent-primary)" />, color: 'rgba(59, 130, 246, 0.1)' };
    }
  };

  const layout = getDynamicLayout();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{t('telemetry.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('telemetry.subtitle')} {deviceId}</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', backgroundColor: layout.color, borderRadius: '8px' }}>
            {layout.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(`telemetry.${telemetry.type}_metric`)}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {telemetry.data[0] ? telemetry.data[0].value : 0} {t(`telemetry.${telemetry.type}_unit`)}
            </div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
            <Battery size={24} color="var(--status-green)" />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('telemetry.battery')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>82%</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
            <Signal size={24} color="var(--status-orange)" />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('telemetry.signal')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>-64 dBm</div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '1.5rem', flex: 1 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{t(`telemetry.${telemetry.type}_title`)}</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {telemetry.type === 'water' ? (
                <BarChart data={telemetry.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={telemetry.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke={
                      telemetry.type === 'gas' ? '#f97316' : 
                      telemetry.type === 'temp' ? '#ec4899' : '#eab308'
                  } strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-secondary)' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{t('telemetry.networkHealth')}</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis domain={[-100, -40]} stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                />
                <Line type="monotone" dataKey="rssi" stroke="var(--status-orange)" strokeWidth={3} dot={{ fill: 'var(--status-orange)', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
