import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const createIcon = (color) => L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const StatusIcons = {
    green: createIcon('green'),
    orange: createIcon('orange'),
    red: createIcon('red'),
    blue: createIcon('blue')
};

const DefaultIcon = StatusIcons.blue;
L.Marker.prototype.options.icon = DefaultIcon;

export default function InteractiveMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [estates, setEstates] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commanding, setCommanding] = useState(null); // ID del dispositivo que está recibiendo comando
  const [statusFilter, setStatusFilter] = useState(location.state?.initialStatus || 'all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      const [estatesData, fleetData] = await Promise.all([
        apiClient.getTopologies(),
        apiClient.getDeviceFleet()
      ]);
      setEstates(estatesData);
      setFleet(fleetData.filter(d => d.position)); // Solo los que tengan coordenadas
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCommand = async (devEui, action, minutes = null) => {
    setCommanding(devEui);
    const res = await apiClient.sendCommand(devEui, action, minutes);
    if (res.success) {
      // Recargar datos para ver el cambio de estado (simulado)
      const fleetData = await apiClient.getDeviceFleet();
      setFleet(fleetData.filter(d => d.position));
    }
    setCommanding(null);
  };

  const handleAction = async (devEui, actionType) => {
    setCommanding(devEui);
    await apiClient.triggerAction(devEui, actionType);
    setCommanding(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('map.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('map.subtitle')}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              {t('map.filterStatus')}
            </label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}
            >
              <option value="all">{t('map.allStatuses')}</option>
              <option value="green">{t('map.normal')}</option>
              <option value="orange">{t('map.warning')}</option>
              <option value="red">{t('map.critical')}</option>
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              {t('map.filterType')}
            </label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}
            >
              <option value="all">{t('map.allTypes')}</option>
              <option value="water">{t('types.water')}</option>
              <option value="gas">{t('types.gas')}</option>
              <option value="temp">{t('types.temp')}</option>
              <option value="light">{t('types.light')}</option>
              <option value="valve">{t('types.valve')}</option>
            </select>
          </div>

          <div style={{ width: '1px', height: '30px', background: 'var(--border-color)', margin: '0 5px' }}></div>

          <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-green)'}}></div> {t('map.normal')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-orange)'}}></div> {t('map.warning')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-red)'}}></div> {t('map.critical')}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
        {/* We use MapContainer from react-leaflet. The CSS filter in index.css will make it dark-mode */}
        <MapContainer center={[39.5, -3.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
          {/* Base OpenStreetMap layer over which the CSS dark inversion applies */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {loading ? null : estates
            .filter(e => (statusFilter === 'all' || e.status === statusFilter))
            .filter(e => (typeFilter === 'all' || e.type === typeFilter))
            .map(estate => (
            <Marker 
              key={`est-${estate.id}`} 
              position={estate.position}
              icon={StatusIcons[estate.status] || StatusIcons.blue}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '150px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{estate.name}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                     {t(`types.${estate.type}`)}
                  </p>

                  <div style={{ 
                    padding: '10px', 
                    background: estate.status === 'green' ? 'rgba(16, 185, 129, 0.1)' : estate.status === 'orange' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    marginBottom: '12px', 
                    border: `1px solid ${estate.status === 'green' ? 'var(--status-green)' : estate.status === 'orange' ? 'var(--status-orange)' : 'var(--status-red)'}`,
                    color: estate.status === 'green' ? 'var(--status-green)' : estate.status === 'orange' ? 'var(--status-orange)' : 'var(--status-red)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {estate.status === 'green' ? '✅ Todo Operativo' : `⚠️ ${estate.statusDetail || 'Requiere atención'}`}
                  </div>

                  {estate.type === 'valve' && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '10px', borderRadius: '8px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCommand(estate.id, 'OPEN'); }}
                          style={{ background: 'var(--status-green)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {t('telemetry.btn_open')}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCommand(estate.id, 'CLOSE'); }}
                          style={{ background: 'var(--status-red)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                        >
                          {t('telemetry.btn_close')}
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/telemetry/${estate.id}`)}
                    style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                  >
                    {t('map.viewTelemetryBtn')}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {loading ? null : fleet
            .filter(d => (statusFilter === 'all' || d.status === statusFilter))
            .filter(d => (typeFilter === 'all' || d.type === typeFilter))
            .map(device => (
            <Marker 
              key={`dev-${device.devEui}`} 
              position={device.position}
              icon={device.type === 'valve' ? StatusIcons.blue : (StatusIcons[device.status] || StatusIcons.blue)}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{device.name}</h4>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: device.valveStatus === 'open' ? 'var(--status-green)' : 'var(--border-color)' }}></div>
                  </div>
                  
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {t(`types.${device.type}`)} | EUI: {device.devEui.slice(-4)}
                  </p>

                  <div style={{ 
                    padding: '10px', 
                    background: device.status === 'green' ? 'rgba(16, 185, 129, 0.1)' : device.status === 'orange' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    marginBottom: '12px', 
                    border: `1px solid ${device.status === 'green' ? 'var(--status-green)' : device.status === 'orange' ? 'var(--status-orange)' : 'var(--status-red)'}`,
                    color: device.status === 'green' ? 'var(--status-green)' : device.status === 'orange' ? 'var(--status-orange)' : 'var(--status-red)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {device.status === 'green' ? '✅ OK' : `⚠️ ${device.statusDetail || 'Alert detected'}`}
                  </div>

                  {device.type === 'valve' && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {t('telemetry.valve_status')}: <span style={{ color: device.valveStatus === 'open' ? 'var(--status-green)' : 'var(--text-primary)' }}>{t(`telemetry.${device.valveStatus}`)}</span>
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button 
                          disabled={commanding === device.devEui || device.valveStatus === 'open'}
                          onClick={() => handleCommand(device.devEui, 'OPEN')}
                          style={{ background: device.valveStatus === 'open' ? 'var(--bg-primary)' : 'var(--status-green)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', opacity: commanding === device.devEui ? 0.5 : 1 }}
                        >
                          {commanding === device.devEui ? t('telemetry.sending') : t('telemetry.btn_open')}
                        </button>
                        <button 
                          disabled={commanding === device.devEui || device.valveStatus === 'closed'}
                          onClick={() => handleCommand(device.devEui, 'CLOSE')}
                          style={{ background: 'var(--status-red)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', opacity: commanding === device.devEui ? 0.5 : 1 }}
                        >
                          {t('telemetry.btn_close')}
                        </button>
                      </div>

                      <button 
                        disabled={commanding === device.devEui}
                        onClick={() => handleCommand(device.devEui, 'OPEN', 30)}
                        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                      >
                        {t('telemetry.btn_timer')}
                      </button>
                    </div>
                  )}

                  {/* Quick Actions for Non-Valve Sensors */}
                  {device.type !== 'valve' && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        {t('dashboard.quickActions')}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {device.type === 'water' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'RESET'); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              🔄 {t('telemetry.reset_btn')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'LEAK'); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              🔍 {t('telemetry.leak_test')}
                            </button>
                          </>
                        )}
                        {device.type === 'gas' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'ALARM'); }} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              🔔 {t('telemetry.test_alarm')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/telemetry/${device.devEui}`); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              ⚙️ Config
                            </button>
                          </>
                        )}
                        {device.type === 'temp' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'SYNC'); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              📡 {t('telemetry.sync_btn')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/telemetry/${device.devEui}`); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              ⚙️ Thresholds
                            </button>
                          </>
                        )}
                        {device.type === 'light' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'CALIBRATE'); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              ⚖️ {t('telemetry.calibrate_btn')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleAction(device.devEui, 'NIGHT'); }} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>
                              🌙 {t('telemetry.night_mode')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/telemetry/${device.devEui}`)}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '6px 0', fontSize: '0.75rem', cursor: 'pointer', width: '100%', marginTop: '8px', textAlign: 'center' }}
                  >
                    {t('map.viewTelemetryBtn')} →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
}
