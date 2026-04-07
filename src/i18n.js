import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Diccionarios quemados en el código (Para el MVP). 
// En sistemas super masivos se acostumbra a separarlos en locales/en/translation.json
const resources = {
  en: {
    translation: {
      "app": {
        "title": "IoT Commander SaaS",
        "subtitle": "The command center for your entire sensor network. Powered by real-time LoRaWAN telemetry and NGSI context management.",
        "adminPortal": "Admin Portal"
      },
      "menu": {
        "dashboard": "Dashboard",
        "liveMap": "Live Map",
        "telemetry": "Telemetry (Demo)",
        "settings": "Settings",
        "provisioning": "Add Sensor",
        "administration": "Administration",
        "auditLogs": "Audit Logs",
        "alertRules": "Alert Rules",
        "energy": "Energy Analytics"
      },
      "login": {
        "signIn": "Sign In",
        "instruction": "Enter your credentials to access your dashboard.",
        "emailLabel": "Email Address",
        "passLabel": "Password",
        "button": "Sign In",
        "loading": "Authenticating...",
        "error": "Invalid credentials. Please use admin@sga.com / admin OR tecnico@sga.com / tech123"
      },
      "dashboard": {
        "overview": "Overview",
        "welcome": "Welcome back. Here's what's happening across all your estates today.",
        "kpiEstates": "Total Estates",
        "kpiSensors": "Active Sensors",
        "kpiAlerts": "Critical Alerts",
        "recentAlerts": "Recent Alerts",
        "quickActions": "Quick Actions",
        "viewMapBtn": "View Interactive Map",
        "diagnoseBtn": "Diagnose Sensor Issues"
      },
      "map": {
        "title": "Live Map",
        "subtitle": "Real-time geographical overview of all managed sensors.",
        "normal": "Normal",
        "warning": "Warning",
        "critical": "Critical",
        "activeSensors": "Active Sensors",
        "status": "Status",
        "viewTelemetryBtn": "View Telemetry",
        "filterStatus": "Filter by Status",
        "filterType": "Filter by Type",
        "allStatuses": "All Statuses",
        "allTypes": "All Types"
      },
      "telemetry": {
        "title": "Sensor Analytics",
        "subtitle": "Live telemetry for node ID:",
        "battery": "Battery Level",
        "signal": "Signal (RSSI)",
        "networkHealth": "Network Health (RSSI)",
        
        "water_title": "Water Consumption Profile",
        "water_metric": "Daily Flow",
        "water_unit": "Liters",
        
        "gas_title": "Gas Concentration Level (LEL)",
        "gas_metric": "Concentration",
        "gas_unit": "ppm",
        
        "temp_title": "Temperature Readings",
        "temp_metric": "Relative Temp",
        "temp_unit": "°C",
        
        "light_title": "Ambient Light Exposure",
        "light_metric": "Illuminance",
        "light_unit": "Lux",
        
        "valve_title": "Smart Valve Control",
        "valve_status": "Current State",
        "open": "Open",
        "closed": "Closed",
        "btn_open": "Open Valve",
        "btn_close": "Close Valve",
        "btn_timer": "Open (30m Timer)",
        "btn_schedule": "Schedule Irrigation",
        "sending": "Sending command...",
        
        "automation_title": "Automation & Scheduling",
        "start_time": "Start Time",
        "end_time": "End Time",
        "active": "Active",
        "save_btn": "Save Schedule",
        
        "config_title": "Hardware Configuration",
        "uplink_frequency": "Uplink Frequency",
        "reset_btn": "Reset Counter",
        "calibrate_btn": "Calibrate Node",
        "sync_btn": "Sync Now",
        "leak_test": "Leak Test",
        "test_alarm": "Test Alarm",
        "night_mode": "Night Mode"
      },
      "types": {
        "water": "Water Meter",
        "gas": "Gas Analyzer",
        "temp": "Thermometer",
        "light": "Light Sensor",
        "valve": "Irrigation Valve"
      },
      "settings": {
        "title": "Corporate Settings",
        "subtitle": "Manage your multi-tenant subscriptions, billing, and access control.",
        "inviteBtn": "Invite User",
        "matrixTitle": "Access Control Matrix",
        "colName": "Name",
        "colEmail": "Email Address",
        "colRole": "Role",
        "colStatus": "Status",
        "colActions": "Actions",
        "denied": "Access Denied",
        "deniedSub": "You do not have corporate permissions to access this Console.",
        "inviteTitle": "Invite New Team Member",
        "inviteSub": "Send an automated invitation to a new technical or administrative collaborator.",
        "formName": "Full Name",
        "formEmail": "Corporate Email",
        "formRole": "Assigned Role",
        "roleAdmin": "SGA Administrator",
        "roleTech": "Field Technician",
        "sendInvite": "Send Invitation"
      },
      "provisioning": {
        "title": "Install New Sensor",
        "subtitle": "Provision a new LoRaWAN physical device via Over The Air Activation (OTAA).",
        "devEui": "Device EUI (16 hex chars)",
        "devEuiSub": "Printed on the back of the device.",
        "appKey": "Application Key (32 hex chars)",
        "appKeySub": "Unique cryptographic key for the Network Server.",
        "type": "Sensor Type",
        "estate": "Assign to Estate",
        "submit": "Provision Device ->",
        "placing": "Registering with Network Server...",
        "success": "Device Successfully Registered!"
      },
      "fleet": {
        "title": "Sensor Fleet Explorer",
        "subtitle": "Global telemetry search filtered by geographical and hardware attributes.",
        "searchPlaceholder": "Search by EUI or custom Name...",
        "allCountries": "All Countries",
        "allTypes": "All Types",
        "colType": "Profile",
        "colBattery": "Battery"
      },
      "admin": {
        "auditLogs": "Security & Audit Logs",
        "alertRules": "Intelligent Alert Rules",
        "branding": "Branding & White Label",
        "reports": "Executive Reports",
        "exportBtn": "Generate Report (PDF/CSV)",
        "generating": "Generating...",
        "auditLogsSubtitle": "Security tracking and historical user actions.",
        "alertRulesSubtitle": "Automated intelligence to monitor your fleet 24/7.",
        "createRuleBtn": "Create Rule",
        "ruleName": "Rule Name",
        "threshold": "Threshold",
        "condition": "Condition",
        "severity": "Severity",
        "activeLabel": "Active",
        "disabledLabel": "Disabled",
        "triggerWhen": "Trigger when",
        "value": "Value",
        "loading": "Loading...",
        "searchLogs": "Search logs...",
        "colTime": "Time",
        "colUser": "User",
        "colAction": "Action",
        "colTarget": "Target Device",
        "brandingSubtitle": "Corporate Color Scheme",
        "brandingLogo": "Dashboard Logo",
        "noLogo": "No logo uploaded",
        "changeLogo": "Change Logo",
        "notificationChannels": "Notification Channels",
        "channelEmail": "Email Alert",
        "channelTelegram": "Telegram Bot",
        "automatedAction": "Automated Action",
        "noAction": "No action (Alert only)",
        "actionCloseValve": "Close Main Valve",
        "actionReset": "Reset Sensor Counter",
        "actionSync": "Force Network Sync"
      },
      "energy": {
        "title": "Energy Consulting",
        "subtitle": "Efficiency analytics and sustainability insights by SGA Data.",
        "kpiSavings": "Estimated Savings",
        "kpiCarbon": "Carbon Offset",
        "kpiForecast": "Forecasted Cost",
        "efficiencyScore": "Efficiency Score",
        "recommendations": "SGA Insights",
        "reductionTip": "Shift high consumption to off-peak hours (14:00-16:00).",
        "maintenanceTip": "Anomaly detected in Valve 4; schedule maintenance to avoid waste.",
        "energyUnit": "kWh",
        "carbonUnit": "kg CO2",
        "costUnit": "€"
      },
      "common": {
        "pending": "Pending",
        "clearAll": "Clear All",
        "noAlerts": "No alerts detected"
      }
    }
  },
  es: {
    translation: {
      "app": {
        "title": "IoT Commander SaaS",
        "subtitle": "El centro de control maestro para tu red de sensores. Impulsado por telemetría LoRaWAN en tiempo real y contexto NGSI.",
        "adminPortal": "Portal de Administración"
      },
      "menu": {
        "dashboard": "Resumen",
        "liveMap": "Mapa en Vivo",
        "telemetry": "Telemetría (Demo)",
        "settings": "Ajustes",
        "provisioning": "Añadir Sensor",
        "administration": "Administración",
        "auditLogs": "Logs de Auditoría",
        "alertRules": "Reglas de Alerta",
        "energy": "Análisis de Energía"
      },
      "login": {
        "signIn": "Iniciar Sesión",
        "instruction": "Ingresa tus credenciales para acceder al panel.",
        "emailLabel": "Correo Electrónico",
        "passLabel": "Contraseña",
        "button": "Entrar",
        "loading": "Autenticando...",
        "error": "Credenciales inválidas. Usa admin@sga.com / admin O tecnico@sga.com / tech123"
      },
      "dashboard": {
        "overview": "Visión General",
        "welcome": "Bienvenido de nuevo. Esto es lo que está pasando en tus fincas el día de hoy.",
        "kpiEstates": "Total de Fincas",
        "kpiSensors": "Sensores Activos",
        "kpiAlerts": "Alertas Críticas",
        "recentAlerts": "Alertas Recientes",
        "quickActions": "Acciones Rápidas",
        "viewMapBtn": "Ver Mapa Interactivo",
        "diagnoseBtn": "Diagnosticar Sensores"
      },
      "map": {
        "title": "Mapa en Vivo",
        "subtitle": "Vista geográfica en tiempo real de los sensores.",
        "normal": "Normal",
        "warning": "Aviso",
        "critical": "Crítico",
        "activeSensors": "Sensores Activos",
        "status": "Estado",
        "viewTelemetryBtn": "Ver Telemetría",
        "filterStatus": "Filtrar por Estado",
        "filterType": "Filtrar por Tipo",
        "allStatuses": "Todos los Estados",
        "allTypes": "Todos los Tipos"
      },
      "telemetry": {
        "title": "Analítica del Sensor",
        "subtitle": "Telemetría en vivo del nodo ID:",
        "battery": "Nivel de Batería",
        "signal": "Señal (RSSI)",
        "networkHealth": "Salud de Red (RSSI)",
        
        "water_title": "Perfil de Consumo de Agua",
        "water_metric": "Flujo Diario",
        "water_unit": "Litros",
        
        "gas_title": "Concentración de Gas (LEL)",
        "gas_metric": "Concentración",
        "gas_unit": "ppm",
        
        "temp_title": "Lecturas de Temperatura",
        "temp_metric": "Temp Relativa",
        "temp_unit": "°C",
        
        "light_title": "Exposición de Luz Ambiental",
        "light_metric": "Iluminancia",
        "light_unit": "Lux",

        "valve_title": "Control de Válvula Inteligente",
        "valve_status": "Estado Actual",
        "open": "Abierta",
        "closed": "Cerrada",
        "btn_open": "Abrir Válvula",
        "btn_close": "Cerrar Válvula",
        "btn_timer": "Abrir (Timer 30m)",
        "btn_schedule": "Programar Riego",
        "sending": "Enviando comando...",

        "automation_title": "Automatización y Horarios",
        "start_time": "Hora Inicio",
        "end_time": "Hora Fin",
        "active": "Activo",
        "save_btn": "Guardar Agenda",

        "config_title": "Configuración de Hardware",
        "uplink_frequency": "Frecuencia de Envío",
        "reset_btn": "Resetear Contador",
        "calibrate_btn": "Calibrar Nodo",
        "sync_btn": "Sincronizar",
        "leak_test": "Test Fuga",
        "test_alarm": "Test Alarma",
        "night_mode": "Modo Noche"
      },
      "types": {
        "water": "Medidor de Agua",
        "gas": "Analizador de Gas",
        "temp": "Termómetro",
        "light": "Sensor de Luz",
        "valve": "Válvula de Riego"
      },
      "settings": {
        "title": "Ajustes Corporativos",
        "subtitle": "Administra tus suscripciones SaaS, facturación y control de acceso.",
        "inviteBtn": "Invitar Usuario",
        "matrixTitle": "Matriz de Control de Acceso",
        "colName": "Nombre",
        "colEmail": "Correo",
        "colRole": "Rol",
        "colStatus": "Estado",
        "colActions": "Acciones",
        "denied": "Acceso Denegado",
        "deniedSub": "No tienes los permisos corporativos para acceder a esta Consola.",
        "inviteTitle": "Invitar a Nuevo Miembro",
        "inviteSub": "Envía una invitación automática a un nuevo colaborador técnico o administrativo.",
        "formName": "Nombre Completo",
        "formEmail": "Email Corporativo",
        "formRole": "Rol Asignado",
        "roleAdmin": "Administrador SGA",
        "roleTech": "Técnico de Campo",
        "sendInvite": "Enviar Invitación"
      },
      "provisioning": {
        "title": "Instalar Nuevo Sensor",
        "subtitle": "Dar de alta en remoto a un dispositivo LoRaWAN físico vía OTAA.",
        "devEui": "Identificador EUI (16 chars hex)",
        "devEuiSub": "Impreso en la pegatina del hardware.",
        "appKey": "Llave de Cifrado (AppKey)",
        "appKeySub": "Normalmente configurada para seguridad de la Red.",
        "type": "Tipo de Sensor",
        "estate": "Asignar a Finca",
        "submit": "Aprovisionar ->",
        "placing": "Dando de alta en ChirpStack...",
        "success": "¡Dispositivo Registrado Exitosamente!"
      },
      "fleet": {
        "title": "Explorador de Flota",
        "subtitle": "Buscador global de telemetría indexado por variables geográficas.",
        "searchPlaceholder": "Busca por Device EUI o Nombre de equipo...",
        "allCountries": "Todos los Países",
        "allTypes": "Todos los Sensores",
        "colType": "Firma (Perfil)",
        "colBattery": "Batería"
      },
      "admin": {
        "auditLogs": "Logs de Auditoría y Seguridad",
        "alertRules": "Reglas de Alerta Inteligente",
        "branding": "Marca Blanca y Personalización",
        "reports": "Informes Ejecutivos",
        "exportBtn": "Generar Informe (PDF/CSV)",
        "generating": "Generando...",
        "auditLogsSubtitle": "Seguimiento de seguridad y acciones históricas.",
        "alertRulesSubtitle": "Inteligencia automatizada 24/7 para tu flota.",
        "createRuleBtn": "Crear Regla",
        "ruleName": "Nombre de la Regla",
        "threshold": "Umbral",
        "condition": "Condición",
        "severity": "Gravedad",
        "activeLabel": "Activo",
        "disabledLabel": "Desactivado",
        "triggerWhen": "Disparar cuando",
        "value": "Valor",
        "loading": "Cargando...",
        "searchLogs": "Buscar en los logs...",
        "colTime": "Hora",
        "colUser": "Usuario",
        "colAction": "Acción",
        "colTarget": "Dispositivo Objetivo",
        "brandingSubtitle": "Esquema de Color Corporativo",
        "brandingLogo": "Logo del Dashboard",
        "noLogo": "Sin logo cargado",
        "changeLogo": "Cambiar Logo",
        "notificationChannels": "Canales de Notificación",
        "channelEmail": "Alerta por Email",
        "channelTelegram": "Bot de Telegram",
        "automatedAction": "Acción Automatizada",
        "noAction": "Sin acción (Solo alerta)",
        "actionCloseValve": "Cerrar Válvula Principal",
        "actionReset": "Resetear Contador",
        "actionSync": "Forzar Sincronización"
      },
      "energy": {
        "title": "Consultoría Energética",
        "subtitle": "Analítica de eficiencia y sostenibilidad por SGA Data.",
        "kpiSavings": "Ahorro Estimado",
        "kpiCarbon": "Huella Carbono",
        "kpiForecast": "Coste Previsto",
        "efficiencyScore": "Índice de Eficiencia",
        "recommendations": "SGA Insights",
        "reductionTip": "Mover consumo alto a horas valle (14:00-16:00).",
        "maintenanceTip": "Anomalía en Válvula 4; programar mantenimiento para evitar desperdicio.",
        "energyUnit": "kWh",
        "carbonUnit": "kg CO2",
        "costUnit": "€"
      },
      "common": {
        "pending": "Pendiente",
        "clearAll": "Limpiar todo",
        "noAlerts": "No se detectan alertas"
      }
    }
  }
};

i18n
  .use(initReactI18next) // Enchufarlo con React
  .init({
    resources,
    lng: "en", // Idioma por defecto
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React ya ataja el XSS
    }
  });

export default i18n;
