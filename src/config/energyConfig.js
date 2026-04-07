/**
 * SGA DATA - Energy Consulting Configuration
 * Este archivo centraliza los factores de conversión y precios para que
 * el portal calcule correctamente el ahorro y la huella de carbono.
 */

export const ENERGY_CONFIG = {
  // Precio medio del kWh en España (ajustable según contrato del cliente)
  pricePerKWh: 0.18, // Euros (€)

  // Factor de Emisión (Mix Eléctrico España - kg CO2 por cada kWh consumido)
  // Fuente: IDAE / RED ELÉCTRICA
  co2EmissionFactor: 0.25, // kg CO2 / kWh

  // Equivalencia de Absorción de Carbono (Media de un árbol adulto en España)
  treeAbsorptionFactor: 21.0, // kg CO2 / árbol / año

  // Margen de Error / Baseline (Consumo teórico sin optimización SGA Data)
  baselineMultiplier: 1.15, // Sumamos un 15% al consumo real para simular la "Línea Base"
  
  // Unidades de Medida
  units: {
    energy: 'kWh',
    carbon: 'kg CO2',
    cost: '€'
  }
};

/**
 * Ejemplo de Función Calculadora (Para implementación futura):
 * const carbonSaved = (kWh_Baseline - kWh_Real) * ENERGY_CONFIG.co2EmissionFactor;
 * const moneySaved = (kWh_Baseline - kWh_Real) * ENERGY_CONFIG.pricePerKWh;
 */
