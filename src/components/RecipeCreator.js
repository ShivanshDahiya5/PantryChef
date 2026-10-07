import { store } from '../store.js';

// Parse natural language ingredient strings like "1 1/2 cups flour" or "2 eggs" into object representations
function parseIngredientsText(text) {
  if (!text) return [];
  return text.split('\n')
    .map(line => {
      line = line.trim();
      if (!line) return null;

      // Matches: quantity (decimals, fractions e.g. "1 1/2" or "0.75"), unit (e.g. "cups", "cloves"), and name (e.g. "olive oil")
      const regexPattern = /^(\d+(?:\s+\d+\/\d+|\/\d+|\.\d+|\.\d+)?)\s*(cups?|tbsps?|tsps?|cloves?|slices?|pieces?|wholes?|ozs?|lbs?|grams?|g|ml|cans?|bags?)?\s+(.*)$/i;
      const match = line.match(regexPattern);
      
      if (match) {
        let qtyStr = match[1] ? match[1].trim() : '1';
        let unit = match[2] ? match[2].trim().toLowerCase() : '';
        let name = match[3] ? match[3].trim().toLowerCase() : '';