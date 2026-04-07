# 📘 Manual de Usuario - Consola SGA DATA (SaaS Enterprise)

Bienvenido a la guía oficial de la plataforma de **Consultoría de Datos y Energía (SGA DATA)**. Este documento detalla cada sección, botón y funcionalidad de la aplicación para entornos industriales.

---

## 1. 📂 Visión General (Dashboard)
Es el "centro de mando" donde se monitoriza el estado global de todas las fincas con **coherencia total de datos**.

*   **Tarjetas KPI Dinámicas (Sincronizadas):**
    *   **Total Fincas (14):** Muestra todas las instalaciones registradas en el sistema.
    *   **Sensores Activos (342):** Refleja la flota real completa.
    *   **Alertas Críticas:** Contador dinámico basado en incidentes en tiempo real.
*   **Alertas Recientes con DNA:** Cada alerta conoce su tipo (Agua, Gas, etc.). Al hacer click, el mapa se abrirá filtrando **automáticamente** por ese tipo y estado.

---

## 2. 🗺️ Mapa en Vivo e Infraestructura (Live Map)
Representación geográfica de todos los activos de la red SGA DATA.

*   **Puntos de Mapa (Markers):**
    *   🟢 **Verde:** Operativo.
    *   🟠 **Naranja (Warning):** Requiere atención (ej: batería baja o aviso).
    *   🔴 **Rojo (Critical):** Alerta activa (ej: fuga o fallo de umbral).
    *   🔵 **Azul:** Válvulas inteligentes de irrigación.
    *   🟣 **Violeta (Antena):** **Gateways LoRaWAN** de infraestructura central.
*   **Popups de Acción:** Control de válvulas, resets, tests de fuga y acceso a telemetría.
*   **Diagnóstico de Red**: Los popups de Gateways muestran Uptime, tráfico de red y fabricante del hardware.
*   **Filtros Inteligentes:** Selectores superiores para filtrar por Estado y Tipo (incluyendo Gateways).

---

## 3. ⚡ Análisis de Energía e Informes PDF (SGA Analytics) 💎
Módulo premium de consultoría energética con capacidad de reporte legal.

*   **KPIs de Sostenibilidad:** Ahorro Mensual (€), Huella de Carbono (kg CO2) y Coste Previsto.
*   **SGA Insights:** Recomendaciones automáticas para la optimización del consumo basadas en tendencias.
*   **Exportación de Auditoría PDF**: Genera un reporte oficial visual con gráficos en alta resolución y branding corporativo listo para entregar a clientes o socios.

---

## 4. 🚀 Explorador de Flota (Fleet Explorer)
Buscador avanzado para gestionar los **342 sensores** de forma masiva.

*   **Contador Global:** Indica en tiempo real cuántos sensores hay detectados en total.
*   **Filtros por Atributo:** Búsqueda por DevEUI, Nombre, Comunidad o Tipo de Sensor.

---

## 5. 🤖 Motor de Reglas (Alert Rules)
Inteligencia automatizada para monitorizar la flota 24/7.

*   **Crear Regla:**
    *   **Selector de Sensor:** Aplica reglas a tipos específicos de dispositivos.
    *   **Condiciones Traducidas:** Configuración bilingüe (ES/EN) de umbrales.
    *   **Acciones Automatizadas:** Disparo de comandos "Downlink" (ej: "Cerrar Válvula si hay fuga detectada").
*   **Interfaz Robusta:** Botón de "Cancelar" para evitar cambios accidentales en la configuración global.

---

## 6. 🛠️ Instalación y Validación (Provisioning)
Sección para el despliegue seguro de nuevo hardware en campo.

*   **Seguridad de Datos:** Los campos DevEUI y AppKey cuentan con validación hexadecimal estricta para prevenir errores de red y ataques de inyección.
*   **Asignación Inteligente:** Selección de la finca y el tipo de servicio (Agua, Gas, Luz, Temp) al que se asignará el nodo.

---

## 👥 Ajustes, Auditoría y Ciberseguridad
Gestión corporativa diseñada para cumplir con normativas de seguridad industrial.

*   **Roles y Permisos (RBAC):**
    *   **Administrador**: Control total sobre ajustes, reglas y provisionamiento.
    *   **Técnico**: Acceso exclusivo a monitorización, mapas y telemetría. Las rutas críticas están bloqueadas por seguridad.
*   **Logs de Auditoría**: Registro inmutable de todas las acciones críticas (quién, cuándo y qué se modificó).
*   **Higiene de Sesión**: La plataforma utiliza `sessionStorage` y cabeceras **CSP (Content Security Policy)** para proteger los datos frente a ataques XSS y asegurar que la sesión se limpie al cerrar la pestaña.

---
*© 2026 SGA DATA - Consultoría de Datos y Energía Industrial.*
