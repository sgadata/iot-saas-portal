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
    { id: 1, name: 'Estate Alpha', position: [40.4168, -3.7038], status: 'green', type: 'water', statusDetail: 'Operativo' },
    { id: 2, name: 'Building Omega', position: [40.4250, -3.6900], status: 'red', type: 'gas', statusDetail: 'Nivel LEL crítico (28%)' },
    { id: 3, name: 'Plaza Center', position: [37.3891, -5.9845], status: 'orange', type: 'temp', statusDetail: 'Batería baja detectada' },
    { id: 4, name: 'Greenhouse Sigma', position: [36.8340, -2.4637], status: 'green', type: 'light', statusDetail: 'Operativo' },
    { id: 5, name: 'Port Complex', position: [41.3851, 2.1734], status: 'green', type: 'water', statusDetail: 'Operativo' },
    { id: 6, name: 'Finca Olivar', position: [38.9168, -6.3438], status: 'green', type: 'valve', statusDetail: 'Operativo' },
  ],
  fleet: [
    { devEui: 'A84041000181A001', name: 'Contador General', type: 'water', status: 'green', country: 'España', community: 'Comunidad de Madrid', estate: 'Estate Alpha', battery: 85, lastSeen: '10m ago', statusDetail: 'Operativo' },
    { devEui: 'A84041000181A002', name: 'Analizador Fuga LEL', type: 'gas', status: 'red', country: 'España', community: 'Comunidad de Madrid', estate: 'Building Omega', battery: 12, lastSeen: '2m ago', config: { uplinkInterval: '10m', alertThreshold: 20 }, statusDetail: 'Alerta: Fuga de Gas (28% LEL)' },
    { devEui: '2B7E151628AED2A6', name: 'Sala Frío Temp', type: 'temp', status: 'orange', country: 'España', community: 'Andalucía', estate: 'Plaza Center', battery: 40, lastSeen: '1h ago', config: { uplinkInterval: '1h' }, statusDetail: 'Batería por debajo del 15%' },
    { devEui: 'A84041000181A004', name: 'Granja Luz LuxSensor', type: 'light', status: 'green', country: 'España', community: 'Andalucía', estate: 'Greenhouse Sigma', battery: 95, lastSeen: '5m ago', config: { uplinkInterval: '30m' }, statusDetail: 'Operativo' },
    { devEui: 'F8C041000181A005', name: 'Bomba Norte Agua', type: 'water', status: 'green', country: 'España', community: 'Cataluña', estate: 'Port Complex', battery: 60, lastSeen: '30m ago', config: { uplinkInterval: '1h' }, statusDetail: 'Operativo' },
    { devEui: 'D8C041000181V006', name: 'Válvula Riego Sector 1', type: 'valve', status: 'green', valveStatus: 'closed', schedule: { start: '08:00', end: '09:00', active: false }, country: 'España', community: 'Extremadura', estate: 'Finca Olivar', battery: 88, lastSeen: '1m ago', position: [38.9168, -6.3438], statusDetail: 'Operativo' },
  ],
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
      return { totalEstates: 14, activeSensors: 342, criticalAlerts: 3 };
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
