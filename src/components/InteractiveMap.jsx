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
L.Marker.prototype.options.icon = DefaultIcon;

export default function InteractiveMap() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await apiClient.getTopologies();
      setEstates(data);
      setLoading(false);
    }
    loadData();
  }, []);

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
            <Marker key={estate.id} position={estate.position}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{estate.name}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                     {t(`types.${estate.type}`)}
                  </p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem' }}>
                    {t('map.status')}: <span style={{ color: `var(--status-${estate.status})`, fontWeight: 'bold', textTransform: 'capitalize' }}>{t(`map.${estate.status === 'green' ? 'normal' : estate.status === 'orange' ? 'warning' : 'critical'}`).toLowerCase()}</span>
                  </p>
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
        </MapContainer>
      </div>
    </div>
  );
}
