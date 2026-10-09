import { store, isIngredientMatched } from '../store.js';

// Helper to format decimal numbers to culinary fractions
function formatQuantity(num) {
  if (!num) return '';
  const val = Math.round(num * 100) / 100;
  const whole = Math.floor(val);
  const frac = val - whole;

    let fracText = '';
  if (Math.abs(frac - 0.25) < 0.05) fracText = '1/4';
  else if (Math.abs(frac - 0.5) < 0.05) fracText = '1/2';
  else if (Math.abs(frac - 0.75) < 0.05) fracText = '3/4';
  else if (Math.abs(frac - 0.33) < 0.05) fracText = '1/3';
