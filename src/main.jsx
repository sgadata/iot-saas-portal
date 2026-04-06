import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Leaflet CSS needs to be imported for map styling
import 'leaflet/dist/leaflet.css';
// Configuración de internacionalización
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
