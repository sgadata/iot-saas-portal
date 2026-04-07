import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';
import { DEVICE_SCHEMAS } from '../config/deviceSchemas';
import ValvePopup from './map/popups/ValvePopup';
import SensorPopup from './map/popups/SensorPopup';
import GatewayPopup from './map/popups/GatewayPopup';
import 'leaflet/dist/leaflet.css';

// Registro de Iconos Leaflet
import L from 'leaflet';
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
    blue: createIcon('blue'),
    violet: createIcon('violet') // Nuevo para Infraestructura (Gateway)
};

export default function InteractiveMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [estates, setEstates] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commanding, setCommanding] = useState(null);
  const [statusFilter, setStatusFilter] = useState(location.state?.initialStatus || 'all');
  const [typeFilter, setTypeFilter] = useState(location.state?.initialType || 'all');

  useEffect(() => {
    async function loadData() {
      const [estatesData, fleetData, gatewayData] = await Promise.all([
        apiClient.getTopologies(),
        apiClient.getDeviceFleet(),
        apiClient.getGateways()
      ]);
      setEstates(estatesData);
      setFleet(fleetData.filter(d => d.position));
      setGateways(gatewayData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCommand = async (devEui, action, minutes = null) => {
    setCommanding(devEui);
    const res = await apiClient.sendCommand(devEui, action, minutes);
    if (res.success) {
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

  /**
   * RENDERIZADO DINÁMICO DE POPUPS (Arquitectura de Plantillas)
   */
  const renderPopupContent = (device) => {
    const schema = DEVICE_SCHEMAS[device.type] || DEVICE_SCHEMAS.default;
    
    if (schema.popupType === 'valve') {
      return <ValvePopup device={device} onCommand={handleCommand} commanding={commanding} />;
    }
    
    if (schema.popupType === 'gateway') {
      return <GatewayPopup device={device} onAction={handleAction} commanding={commanding} />;
    }
    
    return (
      <SensorPopup 
        device={device} 
        schema={schema} 
        onAction={handleAction} 
        commanding={commanding} 
      />
    );
  };

  const getMarkerIcon = (device) => {
    const schema = DEVICE_SCHEMAS[device.type] || DEVICE_SCHEMAS.default;
    
    // Prioridad 1: Gateways (Icono Violeta fijo)
    if (device.type === 'gateway') return StatusIcons.violet;
    
    // Prioridad 2: Fincas (Icono por su estado)
    if (device.id) return StatusIcons[device.status] || StatusIcons.blue;
    
    // Prioridad 3: Sensores normales (Icono por el color del schema)
    return StatusIcons[schema.iconColor] || StatusIcons.blue;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('map.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('map.subtitle')}</p>
        </div>
        
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('map.filterStatus')}</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: 'var(--bg-primary)', color: 'white', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px' }}>
              <option value="all">{t('map.allStatuses')}</option>
              {['green', 'orange', 'red'].map(s => <option key={s} value={s}>{t(`map.${s === 'green' ? 'normal' : s === 'orange' ? 'warning' : 'critical'}`)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t('map.filterType')}</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ background: 'var(--bg-primary)', color: 'white', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px' }}>
              <option value="all">{t('map.allTypes')}</option>
              {Object.keys(DEVICE_SCHEMAS)
                .filter(k => k !== 'default')
                .sort((a,b) => a === 'gateway' ? -1 : 1) // Gateway primero
                .map(type => (
                  <option key={type} value={type}>{t(`types.${type}`)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
        <MapContainer center={[39.5, -3.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Renderizado Unificado de Marcadores (Estates + Fleet + Gateways) */}
          {loading ? null : [...estates, ...fleet, ...gateways]
            .filter(item => (statusFilter === 'all' || item.status === statusFilter))
            .filter(item => (typeFilter === 'all' || item.type === typeFilter))
            .map(item => (
              <Marker 
                key={item.devEui || `est-${item.id}`} 
                position={item.position}
                icon={getMarkerIcon(item)}
              >
                <Popup>
                  {renderPopupContent(item)}
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>
      </div>
    </div>
  );
}
