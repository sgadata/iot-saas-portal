import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Leaf, TrendingDown, Lightbulb, ArrowUpRight, BarChart3 } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnergyDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadStats() {
      const data = await apiClient.getEnergyStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('SGA Energy Audit Generated Successfully! (Simulation)');
    }, 2000);
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>{t('admin.loading')}</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', margin: 0 }}>{t('energy.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '5px 0 0 0' }}>{t('energy.subtitle')}</p>
        </div>
        <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: '700' }}>
          {t('energy.efficiencyScore')}: {stats.efficiencyScore}%
        </div>
      </div>

      {/* Energy KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t('energy.kpiSavings')}</p>
              <h3 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '10px 0', color: 'white' }}>{stats.savings} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{t('energy.energyUnit')}</span></h3>
            </div>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <Zap size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-green)', fontSize: '0.875rem', fontWeight: '600' }}>
            <ArrowUpRight size={16} /> +12.5% vs Last Month
          </div>
        </div>

        <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t('energy.kpiCarbon')}</p>
              <h3 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '10px 0', color: 'white' }}>{stats.carbonOffset} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{t('energy.carbonUnit')}</span></h3>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--status-green)' }}>
              <Leaf size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-green)', fontSize: '0.875rem', fontWeight: '600' }}>
             Equivalent to 42 trees planted
          </div>
        </div>

        <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t('energy.kpiForecast')}</p>
              <h3 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '10px 0', color: 'white' }}>{stats.forecastedCost} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{t('energy.costUnit')}</span></h3>
            </div>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--status-orange)' }}>
              <TrendingDown size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-orange)', fontSize: '0.875rem', fontWeight: '600' }}>
            Predicted increase for next peak
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', minHeight: '400px' }}>
        {/* Main Consumption Chart */}
        <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Efficiency Trends vs Baseline</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div> Real
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div> Baseline
              </div>
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.historicalData}>
                <defs>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '0.875rem' }}
                />
                <Area type="monotone" dataKey="baseline" stroke="rgba(255,255,255,0.2)" fill="transparent" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="consumption" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SGA Insights Section */}
        <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lightbulb size={20} color="var(--status-orange)" /> {t('energy.recommendations')}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recommendations.map(rec => (
              <div key={rec.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: rec.type === 'reduction' ? 'var(--status-green)' : 'var(--status-red)', background: rec.type === 'reduction' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '8px', display: 'inline-block' }}>
                  {rec.type}
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {t(rec.key)}
                </p>
              </div>
            ))}
          </div>

          <button 
            disabled={isExporting}
            onClick={handleExport}
            style={{ marginTop: 'auto', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', opacity: isExporting ? 0.5 : 1 }}
          >
            {isExporting ? 'Generating SGA Audit...' : 'Download Full Energy Audit →'}
          </button>
        </div>
      </div>
    </div>
  );
}
