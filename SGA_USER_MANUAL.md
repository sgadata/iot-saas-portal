# 📘 Manual de Usuario - Consola SGA DATA (SaaS Enterprise)

Bienvenido a la guía oficial de la plataforma de **Consultoría de Datos y Energía (SGA DATA)**. Este documento detalla cada sección, botón y funcionalidad de la aplicación.

---

## 1. 📂 Visión General (Dashboard)
Es el "centro de mando" donde se monitoriza el estado global de todas las fincas.

*   **Tarjetas KPI Interactivas:**
    *   **Total Fincas (14):** Muestra el número total de instalaciones. *Acción:* Al hacer click, te lleva al Mapa filtrado por todas las fincas.
    *   **Sensores Activos (342):** Refleja la flota total de dispositivos LoRaWAN. *Acción:* Al hacer click, abre el Explorador de Flota.
    *   **Alertas Críticas:** Contador de dispositivos en estado 'Rojo'. *Acción:* Al hacer click, abre el Mapa filtrado **solo** por alertas críticas.
*   **Alertas Recientes:** Lista de los últimos 2 eventos detectados. Cada alerta es clickable y te redirige al sensor exacto en el mapa.
*   **Acciones Rápidas:**
    *   **Ver Mapa:** Salto directo a la cartografía.
    *   **Diagnóstico:** Acceso rápido a las gráficas del sensor principal.
*   **Exportar Reporte (Botón 📊):** Genera un informe CSV instantáneo con la telemetría del último mes.

---

## 2. 🗺️ Mapa en Vivo (Live Map)
Representación geográfica de todos los activos de SGA DATA.

*   **Puntos de Mapa (Markers):**
    *   🟢 **Verde:** Operativo y sin alarmas.
    *   🟠 **Naranja (Warning):** Requiere atención rápida (ej: batería baja).
    *   🔴 **Rojo (Critical):** Alerta activa (ej: fuga o fallo de sensor).
    *   🔵 **Azul:** Representación de dispositivos tipo Válvula.
*   **Popups de Acción (Al pulsar un punto):**
    *   **Acciones de Válvula:** Botones de "Abrir", "Cerrar" y "Temporizador (30 min)".
    *   **Acciones Técnicas:** "Resetear Contador", "Test de Fuga", "Test de Alarma" (según el tipo de sensor).
    *   **Ver Telemetría:** Enlace directo a las gráficas del sensor.
*   **Filtros Avanzados:** Selectores superiores para filtrar por **Estado** (Normal/Warning/Crítico) y **Tipo de Sensor** (Agua, Gas, Temperatura, Luz, Válvula).

---

## 3. ⚡ Análisis de Energía (SGA Analytics) 💎
Módulo premium de consultoría energética.

*   **KPIs de Sostenibilidad:**
    *   **Ahorro Mensual (€):** Dinero ahorrado gracias a la optimización.
    *   **Huella de Carbono (kg CO2):** Reducción de emisiones vs. línea base.
    *   **Coste Previsto:** Proyección del gasto energético para el final del mes.
*   **Gráfico de Eficiencia:** Comparativa visual entre el consumo real y el baseline teórico.
*   **SGA Insights:** Recomendaciones automáticas del sistema para detectar mantenimientos o ahorros ocultos.
*   **Download Full Energy Audit:** Botón para generar la auditoría completa en formato profesional.

---

## 4. 🚀 Instalación (Provisioning)
Sección para el despliegue de nuevo hardware en campo.

*   **Formulario OTAA:** Permite dar de alta dispositivos LoRaWAN introduciendo el **DevEUI** y la **AppKey**.
*   **Asignación Inteligente:** Selección de la finca y el tipo de servicio al que se asignará el sensor.

---

## 5. 🤖 Motor de Reglas (Alert Rules)
El cerebro de la automatización de la plataforma.

*   **Crear Regla:**
    *   **Condiciones:** Define umbrales (ej: Si Temperatura > 35°C).
    *   **Severidad:** Warning o Crítico.
*   **Canales Externos:** Opción de activar notificaciones por **Email** o **Telegram**.
*   **Acciones Automatizadas:** La regla puede disparar comandos "Downlink" automáticos (ej: "Cerrar Válvula si hay fuga").

---

## 6. 👥 Ajustes y Equipo (Settings)
Gestión corporativa y multi-tenant.

*   **Gestión de Usuarios:**
    *   **Invitar Usuario:** Modal para añadir miembros con roles de **Admin** o **Técnico**.
    *   **Matriz de Acceso:** Tabla con el estado (Activo, Pendiente) de cada colaborador.
*   **Branding Corporativo:**
    *   **Color Primario:** Selector para cambiar el color de acento de toda la web.
    *   **Logo SGA:** Subida y visualización del logo oficial de la empresa.

---

## 7. 📑 Logs de Auditoría
Registro de seguridad de todas las acciones humanas (quién abrió una válvula, quién cambió una regla).

---

## 🔐 Seguridad y Acceso (Login)
*   Acceso restringido por email y contraseña.
*   Control de roles: Los técnicos no pueden editar reglas de administración.
