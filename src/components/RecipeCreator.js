import { store } from '../store.js';

// Parse natural language ingredient strings like "1 1/2 cups flour" or "2 eggs" into object representations
function parseIngredientsText(text) {
  if (!text) return [];
  return text.split('\n')
    .map(line => {
      line = line.trim();
      if (!line) return null;
