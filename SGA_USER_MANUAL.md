# 📘 Manual de Usuario - Consola SGA DATA (SaaS Enterprise)

Bienvenido a la guía oficial de la plataforma de **Consultoría de Datos y Energía (SGA DATA)**. Este documento detalla cada sección, botón y funcionalidad de la aplicación.

---

## 1. 📂 Visión General (Dashboard)
Es el "centro de mando" donde se monitoriza el estado global de todas las fincas con **coherencia total de datos**.

*   **Tarjetas KPI Dinámicas (Sincronizadas):**
    *   **Total Fincas (14):** Muestra todas las instalaciones registradas en el sistema. Al hacer click, verás las 14 en el mapa.
    *   **Sensores Activos (342):** Refleja la flota real completa. Al hacer click, te lleva al Explorador de Flota con los 342 dispositivos.
    *   **Alertas Críticas:** Contador dinámico basado en estados 'Rojo' actuales.
*   **Alertas Recientes con DNA:** Cada alerta conoce su tipo (Agua, Gas, etc.). Al hacer click, el mapa se abrirá filtrando **automáticamente** por ese tipo y estado.

---

## 2. 🗺️ Mapa en Vivo (Live Map)
Representación geográfica de todos los activos de SGA DATA.

*   **Puntos de Mapa (Markers):**
    *   🟢 **Verde:** Operativo.
    *   🟠 **Naranja (Warning):** Requiere atención (ej: batería baja).
    *   🔴 **Rojo (Critical):** Alerta activa (ej: fuga o fallo).
    *   🔵 **Azul:** Válvulas inteligentes.
*   **Popups de Acción:** Control de válvulas, resets, tests de fuga y acceso a telemetría.
*   **Filtros Inteligentes:** Selectores superiores para filtrar por Estado y Tipo de Sensor de forma simultánea.

---

## 3. ⚡ Análisis de Energía (SGA Analytics) 💎
Módulo premium de consultoría energética.

*   **KPIs de Sostenibilidad:** Ahorro Mensual (€), Huella de Carbono (kg CO2) y Coste Previsto.
*   **SGA Insights:** Recomendaciones automáticas para la optimización del consumo.

---

## 4. 🚀 Explorador de Flota (Fleet Explorer)
Buscador avanzado para gestionar los **342 sensores** de la red.

*   **Contador Global:** Indica en tiempo real cuántos sensores hay detectados en total.
*   **Filtros por Atributo:** Búsqueda por DevEUI, Nombre, Comunidad o Tipo de Sensor.

---

## 5. 🤖 Motor de Reglas (Alert Rules)
Inteligencia automatizada para monitorizar la flota 24/7.

*   **Crear Regla:**
    *   **Selector de Sensor:** Permite elegir si la regla aplica a Agua, Gas, Temperatura, etc.
    *   **Condiciones Traducidas:** Configuración bilingüe (Mayor que, Menor que, Igual a).
    *   **Gravedad:** Warning o Crítico con colores distintivos.
    *   **Iconografía Dinámica:** Cada regla muestra el icono del tipo de sensor asignado para una identificación rápida.
*   **Canales y Acciones:** Notificaciones por Email/Telegram y comandos automáticos (ej: cerrar válvula).
*   **Interfaz mejorada:** Botón de "Cancelar" claro para cerrar el formulario sin guardar cambios.

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
