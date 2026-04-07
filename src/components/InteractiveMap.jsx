import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';
import { DEVICE_SCHEMAS } from '../config/deviceSchemas';
import ValvePopup from './map/popups/ValvePopup';
import SensorPopup from './map/popups/SensorPopup';
import GatewayPopup from './map/popups/GatewayPopup';
import EstatePopup from './map/popups/EstatePopup';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { 
  Activity, 
  Droplet, 
  Flame, 
  Thermometer, 
  Sun, 
  Settings2, 
  Radio, 
  Building2 
} from 'lucide-react';

// Motor de Iconos Inteligentes (Color = Estado, Símbolo = Tipo)
const getMarkerIcon = (device) => {
    const status = device.status || 'green';
    const type = device.type;
    const isEstate = !!device.id;

    // 1. Determinar el Símbolo (Lucide Icon)
    let IconNode = Activity;
    if (isEstate) IconNode = Building2;
    else if (type === 'water') IconNode = Droplet;
    else if (type === 'gas') IconNode = Flame;
    else if (type === 'temp') IconNode = Thermometer;
    else if (type === 'light') IconNode = Sun;
    else if (type === 'valve') IconNode = Settings2;
    else if (type === 'gateway') IconNode = Radio;

    // 2. Determinar el Color (Health Status)
    const colorMap = {
        green: '#238636',
        orange: '#d29922',
        red: '#f85149',
        blue: '#3b82f6'
    };
    const bgColor = isEstate ? colorMap.blue : colorMap[status];

    // 3. Generar el HTML del Marcador
    const iconHtml = renderToString(
        <div className={`custom-marker-container ${status === 'red' ? 'status-red' : ''}`}>
            <div className="marker-pin" style={{ backgroundColor: bgColor }}>
                <div className="marker-icon-wrapper">
                    <IconNode size={16} strokeWidth={2.5} color="white" />
                </div>
            </div>
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
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
    // Caso 1: Es una Finca (Estate)
    if (device.id && !device.devEui) {
      return <EstatePopup estate={device} />;
    }

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

        {/* Legend Flotante Premium */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, background: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(8px)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: '220px' }}>
            <div>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{t('map.legend_status')}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#238636' }}></div> {t('map.normal')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d29922' }}></div> {t('map.warning')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', gridColumn: 'span 2' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f85149', boxShadow: '0 0 8px #f85149' }}></div> {t('map.critical')}
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{t('map.legend_types')}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Droplet size={14} color="var(--text-secondary)" /> {t('types.water')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Settings2 size={14} color="var(--text-secondary)" /> {t('types.valve')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Radio size={14} color="var(--text-secondary)" /> {t('types.gateway')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Flame size={14} color="var(--text-secondary)" /> {t('types.gas')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Thermometer size={14} color="var(--text-secondary)" /> {t('types.temp')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Sun size={14} color="var(--text-secondary)" /> {t('types.light')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                        <Building2 size={14} color="var(--accent-primary)" /> {t('dashboard.kpiEstates')}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
