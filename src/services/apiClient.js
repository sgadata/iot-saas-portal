/**
 * API Client Simulator (Mock Service)
 * Este archivo previene que los datos se quemen en la UI.
 * En el futuro, cambiaremos 'USE_MOCK_API' a false e implementaremos los fetch
 * reales contra nuestro servidor Orion/Postgres.
 */

const USE_MOCK_API = true;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DATA_CACHE = {
  estates: [
    { id: 1, name: 'Estate Alpha', position: [40.4168, -3.7038], status: 'red', type: 'water', statusDetail: 'Flujo de agua anormal detected' },
    { id: 2, name: 'Building Omega', position: [40.4250, -3.6900], status: 'red', type: 'gas', statusDetail: 'Nivel LEL crítico (28%)' },
    { id: 3, name: 'Plaza Center', position: [37.3891, -5.9845], status: 'red', type: 'temp', statusDetail: 'Fallo Crítico: Sensor Temp' },
    { id: 4, name: 'Greenhouse Sigma', position: [36.8340, -2.4637], status: 'green', type: 'light', statusDetail: 'Operativo' },
    { id: 5, name: 'Port Complex', position: [41.3851, 2.1734], status: 'green', type: 'water', statusDetail: 'Operativo' },
    { id: 6, name: 'Finca Olivar', position: [38.9168, -6.3438], status: 'green', type: 'valve', statusDetail: 'Operativo' },
    { id: 7, name: 'Residencial Sol', position: [40.4530, -3.6883], status: 'green', type: 'water', statusDetail: 'Operativo' },
    { id: 8, name: 'Oficinas Norte', position: [40.4700, -3.6900], status: 'orange', type: 'temp', statusDetail: 'Batería baja (Sensor B4)' },
    { id: 9, name: 'Almacén Central', position: [40.4300, -3.6700], status: 'green', type: 'gas', statusDetail: 'Operativo' },
    { id: 10, name: 'Centro Salud', position: [40.4100, -3.7100], status: 'green', type: 'temp', statusDetail: 'Operativo' },
    { id: 11, name: 'Escuela Infantil', position: [40.4000, -3.7200], status: 'green', type: 'temp', statusDetail: 'Operativo' },
    { id: 12, name: 'Parking Mall', position: [40.3900, -3.7300], status: 'green', type: 'gas', statusDetail: 'Operativo' },
    { id: 13, name: 'Huerto Urbano', position: [40.3800, -3.7400], status: 'green', type: 'water', statusDetail: 'Operativo' },
    { id: 14, name: 'Edificio Sky', position: [40.3700, -3.7500], status: 'green', type: 'light', statusDetail: 'Operativo' },
  ],
  fleet: [],
  gateways: [], // Nueva infraestructura core
  rules: [
    { id: 1, name: 'High Temperature Alert', sensorType: 'temp', condition: '>', threshold: 35, severity: 'critical', active: true },
    { id: 2, name: 'Low Battery Warning', sensorType: 'all', condition: '<', threshold: 15, severity: 'warning', active: true },
  ],
  auditLogs: [
    { id: 1, time: '2026-04-07 10:30:15', user: 'Sebastian', action: 'OPEN_VALVE', target: 'D8C041000181V006' },
    { id: 2, time: '2026-04-07 09:15:00', user: 'Gerardo', action: 'CHANGE_CONFIG', target: 'A84041000181A002' },
  ],
  branding: {
    logoUrl: null,
    primaryColor: '#3b82f6'
  },
  telemetryProfiles: {
    "root": [
      { time: '00:00', value: 120, battery: 85, rssi: -65 },
      { time: '04:00', value: 80, battery: 84, rssi: -63 },
      { time: '08:00', value: 350, battery: 84, rssi: -68 },
      { time: '12:00', value: 420, battery: 83, rssi: -70 },
      { time: '16:00', value: 290, battery: 83, rssi: -65 },
      { time: '20:00', value: 450, battery: 82, rssi: -62 },
      { time: '24:00', value: 150, battery: 82, rssi: -64 },
    ]
  }
};

// --- EL GENERADOR DE COHERENCIA (342 Sensores) ---
const typesPool = ['water', 'gas', 'temp', 'light', 'valve'];
const communitiesPool = ['Comunidad de Madrid', 'Andalucía', 'Cataluña', 'Extremadura', 'Castilla y León'];

for (let i = 0; i < 342; i++) {
  const type = typesPool[i % typesPool.length];
  const estateIdx = i % DATA_CACHE.estates.length;
  const estate = DATA_CACHE.estates[estateIdx];
  const community = communitiesPool[i % communitiesPool.length];
  
  let status = 'green';
  if (i < 3) status = 'red'; // Forzamos 3 críticos para el Dashboard
  else if (i < 8) status = 'orange'; // Forzamos 5 warnings
  
  DATA_CACHE.fleet.push({
    devEui: `A84041000181${(1000 + i).toString()}`,
    name: `Sensor ${type.toUpperCase()} #${i + 1}`,
    type: type,
    status: status,
    country: 'España',
    community: community,
    estate: estate.name,
    battery: status === 'orange' ? 12 : Math.floor(Math.random() * (98 - 40) + 40),
    lastSeen: `${Math.floor(Math.random() * 60)}m ago`,
    statusDetail: status === 'red' ? 'CRÍTICO: Umbral de alerta alcanzado' : (status === 'orange' ? 'Aviso: Batería baja' : 'Operativo'),
    position: i < 14 ? estate.position : null
  });
}

// --- GENERADOR DE GATEWAYS (Infraestructura 5 nodos) ---
const gatewayLocations = [
  { name: 'GW-Murcia-Centro', pos: [38.0, -1.1] },
  { name: 'GW-Albacete-Norte', pos: [39.0, -1.8] },
  { name: 'GW-Castilla-SGA', pos: [39.8, -3.5] },
  { name: 'GW-Valencia-Agro', pos: [39.4, -0.4] },
  { name: 'GW-Toledo-Industrial', pos: [39.9, -4.0] }
];

gatewayLocations.forEach((gw, i) => {
  DATA_CACHE.gateways.push({
    devEui: `F00000000000${(100 + i).toString()}`,
    name: gw.name,
    type: 'gateway',
    status: i === 4 ? 'orange' : 'green', // Uno con aviso
    position: gw.pos,
    vendor: 'RAKWireless 7249 Turbo',
    uptime: '99.9%',
    traffic: `${Math.floor(Math.random() * 5000)} packets/h`,
    connectedNodes: Math.floor(Math.random() * 100) + 20
  });
});

export const apiClient = {
  getTopologies: async () => {
    if (USE_MOCK_API) {
      await delay(600); // Simulamos red
      return DATA_CACHE.estates;
    }
    // Future fetch to FIWARE/Mongo
  },

  getTelemetry: async (deviceId) => {
    if (USE_MOCK_API) {
      await delay(800);
      
      // Select data and meta based on device type magically mapping to IDs
      let type = 'water';
      if (deviceId == 2) type = 'gas';
      if (deviceId == 3) type = 'temp';
      if (deviceId == 4) type = 'light';

      // We clone the root metric arrays and alter their ranges naturally to mock values
      const data = DATA_CACHE.telemetryProfiles.root.map(item => {
        let val = item.value;
        if (type === 'gas') val = Math.floor(Math.random() * (120 - 20) + 20); // ppm
        if (type === 'temp') val = Math.floor(Math.random() * (35 - 15) + 15); // celsius
        if (type === 'light') val = Math.floor(Math.random() * (800 - 100) + 100); // lux

        return { ...item, value: val };
      });

      return { type, data };
    }
    // Future fetch to PostgreSQL Timescale
  },

  getGlobalMetrics: async () => {
    if (USE_MOCK_API) {
      await delay(400);
      return { 
        totalEstates: DATA_CACHE.estates.length, 
        activeSensors: DATA_CACHE.fleet.length, 
        criticalAlerts: DATA_CACHE.fleet.filter(d => d.status === 'red').length 
      };
    }
  },

  registerLoRaDevice: async (devEui, appKey, type, estateId) => {
    if (USE_MOCK_API) {
      await delay(1500); // Wait 1.5s to simulate POSTing to Chirpstack 
      return { success: true, message: 'Device provisioned perfectly over OTAA.' };
    }
  },

  getDeviceFleet: async () => {
      if (USE_MOCK_API) {
          await delay(600);
          return DATA_CACHE.fleet;
      }
  },

  getGateways: async () => {
    if (USE_MOCK_API) {
      await delay(600);
      return DATA_CACHE.gateways;
    }
  },

  sendCommand: async (devEui, action, minutes = null) => {
    if (USE_MOCK_API) {
      console.log(`[MOCK DOWNLINK] Sending ${action} to ${devEui}${minutes ? ` for ${minutes} min` : ''}`);
      await delay(2000); // Simulamos la latencia LoRaWAN
      
      const device = DATA_CACHE.fleet.find(d => d.devEui === devEui);
      if (device) {
        device.valveStatus = action === 'OPEN' ? 'open' : 'closed';
      }
      
      return { success: true, message: `Command ${action} sent successfully` };
    }
  },

  saveSchedule: async (devEui, schedule) => {
    if (USE_MOCK_API) {
      await delay(1000);
      const device = DATA_CACHE.fleet.find(d => d.devEui === devEui);
      if (device) device.schedule = schedule;
      return { success: true };
    }
  },

  updateConfig: async (devEui, config) => {
    if (USE_MOCK_API) {
      await delay(1000);
      const device = DATA_CACHE.fleet.find(d => d.devEui === devEui);
      if (device) device.config = { ...device.config, ...config };
      return { success: true };
    }
  },

  triggerAction: async (devEui, actionType) => {
    if (USE_MOCK_API) {
      console.log(`[QUICK ACTION] ${actionType} on device ${devEui}`);
      await delay(1200);
      apiClient.logAction('Sebastian', actionType, devEui); // Mock user
      return { success: true, message: `Action ${actionType} executed correctly` };
    }
  },

  logAction: (user, action, target) => {
    const newLog = {
      id: DATA_CACHE.auditLogs.length + 1,
      time: new Date().toLocaleString(),
      user,
      action,
      target
    };
    DATA_CACHE.auditLogs.unshift(newLog);
  },

  getAuditLogs: async () => {
    if (USE_MOCK_API) {
      await delay(500);
      return DATA_CACHE.auditLogs;
    }
  },

  getAlertRules: async () => {
    if (USE_MOCK_API) {
      await delay(500);
      return DATA_CACHE.rules;
    }
  },

  getBranding: async () => {
    if (USE_MOCK_API) return DATA_CACHE.branding;
  },

  updateBranding: async (newBranding) => {
    if (USE_MOCK_API) {
      DATA_CACHE.branding = { ...DATA_CACHE.branding, ...newBranding };
      return { success: true };
    }
  },

  // User & Tenant Management Mock
  getUsers: async () => {
    await delay(600);
    return [
      { id: 1, name: 'Sebastian A.', email: 'admin@sga.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Tecnico Campo', email: 'tecnico@sga.com', role: 'tecnico', status: 'active' },
      { id: 3, name: 'Consultor Junior', email: 'junior@sga.com', role: 'tecnico', status: 'pending' },
    ];
  },

  // Energy Analytics Mock
  getEnergyStats: async () => {
    await delay(800);
    return {
      savings: 1245.8,
      carbonOffset: 450.2,
      forecastedCost: 890.0,
      efficiencyScore: 88,
      historicalData: [
        { month: 'Jan', consumption: 450, baseline: 500 },
        { month: 'Feb', consumption: 420, baseline: 490 },
        { month: 'Mar', consumption: 400, baseline: 510 },
        { month: 'Apr', consumption: 380, baseline: 500 },
        { month: 'May', consumption: 350, baseline: 520 },
        { month: 'Jun', consumption: 330, baseline: 530 },
      ],
      recommendations: [
        { id: 1, type: 'reduction', key: 'energy.reductionTip' },
        { id: 2, type: 'maintenance', key: 'energy.maintenanceTip' }
      ]
    };
  }
};
