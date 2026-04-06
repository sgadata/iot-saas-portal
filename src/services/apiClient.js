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
    { id: 1, name: 'Estate Alpha', position: [40.4168, -3.7038], status: 'green', type: 'water' },
    { id: 2, name: 'Building Omega', position: [40.4250, -3.6900], status: 'red', type: 'gas' },
    { id: 3, name: 'Plaza Center', position: [37.3891, -5.9845], status: 'orange', type: 'temp' },
    { id: 4, name: 'Greenhouse Sigma', position: [36.8340, -2.4637], status: 'green', type: 'light' },
    { id: 5, name: 'Port Complex', position: [41.3851, 2.1734], status: 'green', type: 'water' },
  ],
  fleet: [
    { devEui: 'A84041000181A001', name: 'Contador General', type: 'water', status: 'green', country: 'España', community: 'Comunidad de Madrid', estate: 'Estate Alpha', battery: 85, lastSeen: '10m ago' },
    { devEui: 'A84041000181A002', name: 'Analizador Fuga LEL', type: 'gas', status: 'red', country: 'España', community: 'Comunidad de Madrid', estate: 'Building Omega', battery: 12, lastSeen: '2m ago' },
    { devEui: '2B7E151628AED2A6', name: 'Sala Frío Temp', type: 'temp', status: 'orange', country: 'España', community: 'Andalucía', estate: 'Plaza Center', battery: 40, lastSeen: '1h ago' },
    { devEui: 'A84041000181A004', name: 'Granja Luz LuxSensor', type: 'light', status: 'green', country: 'España', community: 'Andalucía', estate: 'Greenhouse Sigma', battery: 95, lastSeen: '5m ago' },
    { devEui: 'F8C041000181A005', name: 'Bomba Norte Agua', type: 'water', status: 'green', country: 'España', community: 'Cataluña', estate: 'Port Complex', battery: 60, lastSeen: '30m ago' },
  ],
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
  }
};
