import { store, isIngredientMatched } from '../store.js';

// Helper to format decimal numbers to culinary fractions
function formatQuantity(num) {
  if (!num) return '';
  const val = Math.round(num * 100) / 100;
  const whole = Math.floor(val);
  const frac = val - whole;
