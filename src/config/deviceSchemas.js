/**
 * DEVICE SCHEMAS REGISTRY
 * Esta es la "Fuente de Verdad" para la UI de cada tipo de dispositivo.
 * Permite añadir nuevos sensores sin tocar el código del Mapa.
 */

export const DEVICE_SCHEMAS = {
  water: {
    iconColor: 'green',
    popupType: 'sensor',
    actions: [
      { id: 'RESET', labelKey: 'telemetry.reset_btn', icon: '🔄' },
      { id: 'LEAK', labelKey: 'telemetry.leak_test', icon: '🔍' }
    ]
  },
  gas: {
    iconColor: 'red',
    popupType: 'sensor',
    actions: [
      { id: 'ALARM', labelKey: 'telemetry.test_alarm', icon: '🔔', variant: 'danger' },
      { id: 'CONFIG', labelKey: 'telemetry.config_title', icon: '⚙️', isLink: true }
    ]
  },
  temp: {
    iconColor: 'orange',
    popupType: 'sensor',
    actions: [
      { id: 'SYNC', labelKey: 'telemetry.sync_btn', icon: '📡' },
      { id: 'CONFIG', labelKey: 'telemetry.config_title', icon: '⚙️', isLink: true }
    ]
  },
  light: {
    iconColor: 'blue',
    popupType: 'sensor',
    actions: [
      { id: 'CALIBRATE', labelKey: 'telemetry.calibrate_btn', icon: '⚖️' },
      { id: 'NIGHT', labelKey: 'telemetry.night_mode', icon: '🌙' }
    ]
  },
  valve: {
    iconColor: 'blue',
    popupType: 'valve',
    actions: [] // Las válvulas suelen tener su propio set de botones fijos (Open/Close)
  },
  // Ejemplo de extensibilidad rápida:
  default: {
    iconColor: 'blue',
    popupType: 'sensor',
    actions: [
      { id: 'SYNC', labelKey: 'telemetry.sync_btn', icon: '📡' }
    ]
  }
};
