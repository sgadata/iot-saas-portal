import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

let ValveIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function InteractiveMap() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [estates, setEstates] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commanding, setCommanding] = useState(null); // ID del dispositivo que está recibiendo comando

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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('map.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('map.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-green)'}}></div> {t('map.normal')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-orange)'}}></div> {t('map.warning')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-red)'}}></div> {t('map.critical')}</span>
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
          
          {loading ? null : estates.map(estate => (
            <Marker 
              key={`est-${estate.id}`} 
              position={estate.position}
              icon={estate.type === 'valve' ? ValveIcon : DefaultIcon}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '150px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{estate.name}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                     {t(`types.${estate.type}`)}
                  </p>

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

          {/* Individual Sensors (like Valves) */}
          {loading ? null : fleet.map(device => (
            <Marker 
              key={`dev-${device.devEui}`} 
              position={device.position}
              icon={device.type === 'valve' ? ValveIcon : DefaultIcon}
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
