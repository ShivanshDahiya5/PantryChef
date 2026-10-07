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

        // Parse fraction to float
        let quantity = 1;
        if (qtyStr) {
          if (qtyStr.includes('/')) {
            const parts = qtyStr.split(/\s+/);
            if (parts.length === 2) {
              const whole = parseFloat(parts[0]);
              const fracParts = parts[1].split('/');
              quantity = whole + (parseFloat(fracParts[0]) / parseFloat(fracParts[1]));
            } else {
              const fracParts = parts[0].split('/');
              quantity = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
            }
          } else {
            quantity = parseFloat(qtyStr);
          }
        }

        return {
          name: name,
          quantity: isNaN(quantity) ? 1 : quantity,
          unit: unit || 'pieces'
        };
      }

      // Fallback: If line doesn't match normal format, check if it starts with a plain number
      const fallbackMatch = line.match(/^(\d+)?\s*(.*)$/);
      if (fallbackMatch) {
        const qty = fallbackMatch[1] ? parseFloat(fallbackMatch[1]) : 1;
        const name = fallbackMatch[2] ? fallbackMatch[2].trim().toLowerCase() : line.toLowerCase();
        return {
            name: name,
          quantity: isNaN(qty) ? 1 : qty,
          unit: 'pieces'
        };
      }
      
      return {
        name: line.toLowerCase(),
        quantity: 1,
        unit: 'pieces'
      };
    })
    .filter(Boolean);
}

// Parse instructions lines
function parseInstructionsText(text) {
  if (!text) return [];
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export function initRecipeCreator(modalOverlay) {
  modalOverlay.innerHTML = `
    <div class="modal-container">
      <button class="modal-close" title="Close modal">&times;</button>
      <form id="creator-form" class="creator-form">
        <h2 class="form-title">Create Custom Recipe</h2>

        <div class="form-group">
          <label for="recipe-name">Recipe Title</label>
          <input type="text" id="recipe-name" class="form-input" placeholder="e.g. Grandma's Famous Lasagna" required />
        </div>

        <div class="form-row-grid">
          <div class="form-group">
            <label for="recipe-category">Meal Category</label>
            <select id="recipe-category" class="form-select" required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner" selected>Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
          <div class="form-group">
            <label for="recipe-difficulty">Cooking Difficulty</label>
            <select id="recipe-difficulty" class="form-select" required>
              <option value="Easy" selected>Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>