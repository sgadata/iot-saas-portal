import React, { useState, useEffect } from 'react';
import { Search, Filter, Cpu, Battery, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export default function FleetExplorer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fleet, setFleet] = useState([]);
  
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [communityFilter, setCommunityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    apiClient.getDeviceFleet().then(setFleet);
  }, []);

  // Compute unique filter options from the fleet
  const countries = ['All', ...new Set(fleet.map(d => d.country))];
  const communities = ['All', ...new Set(fleet.map(d => d.community))];
  const types = ['All', ...new Set(fleet.map(d => d.type))];

  // Pipeline de Filtros
  const filteredFleet = fleet.filter(device => {
    const matchesSearch = device.devEui.toLowerCase().includes(search.toLowerCase()) || 
                          device.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'All' || device.country === countryFilter;
    const matchesCommunity = communityFilter === 'All' || device.community === communityFilter;
    const matchesType = typeFilter === 'All' || device.type === typeFilter;

    return matchesSearch && matchesCountry && matchesCommunity && matchesType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('fleet.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('fleet.subtitle')} | <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{fleet.length} total sensors</span> detected
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="dashboard-grid card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
              <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '10px', left: '12px' }} />
              <input 
                 type="text" 
                 placeholder={t('fleet.searchPlaceholder')}
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white' }}
              />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
             <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>
                 {countries.map(c => <option key={c} value={c}>{c === 'All' ? t('fleet.allCountries') : c}</option>)}
             </select>

             <select value={communityFilter} onChange={e => setCommunityFilter(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>
                 {communities.map(c => <option key={c} value={c}>{c === 'All' ? t('fleet.allCommunities') : c}</option>)}
             </select>

             <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>
                 {types.map(tOption => <option key={tOption} value={tOption}>{tOption === 'All' ? t('fleet.allTypes') : t(`types.${tOption}`)}</option>)}
             </select>
          </div>
      </div>

      {/* DATA GRID */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <th style={{ padding: '1rem' }}>Device EUI / Name</th>
                    <th style={{ padding: '1rem' }}>Estate & Location</th>
                    <th style={{ padding: '1rem' }}>{t('fleet.colType')}</th>
                    <th style={{ padding: '1rem' }}>{t('fleet.colBattery')}</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredFleet.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No devices match the filters.</td></tr>
                ) : (
                    filteredFleet.map(device => (
                        <tr key={device.devEui} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hoverable-row">
                            <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Cpu size={18} color="var(--accent-primary)" />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{device.devEui}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{device.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <div>{device.estate}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{device.community}, {device.country}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', backgroundColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                                    {t(`types.${device.type}`)}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: device.battery < 20 ? 'var(--status-red)' : 'var(--status-green)' }}>
                                    <Battery size={16} /> {device.battery}%
                                </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                <button 
                                  onClick={() => navigate(`/telemetry/${device.type === 'gas' ? 2 : device.type === 'temp' ? 3 : device.type === 'light' ? 4 : 1}`)}
                                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Eye size={16} /> View
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
