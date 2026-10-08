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

        <div class="form-group">
          <label for="recipe-desc">Short Description</label>
          <textarea id="recipe-desc" class="form-textarea" placeholder="Describe your delicious creation..." required></textarea>
        </div>

        <div class="form-row-grid">
          <div class="form-group">
            <label for="recipe-prep">Prep Time (mins)</label>
            <input type="number" id="recipe-prep" class="form-input" min="0" value="10" required />
          </div>
          <div class="form-group">
          <label for="recipe-cook">Cook Time (mins)</label>
            <input type="number" id="recipe-cook" class="form-input" min="0" value="15" required />
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label for="recipe-servings">Default Servings</label>
            <input type="number" id="recipe-servings" class="form-input" min="1" value="2" required />
          </div>
        </div>

        <!-- Dietary Checkboxes -->
        <div class="form-group">
          <label>Dietary Requirement Tags</label>
          <div class="dietary-filters" style="margin-top: 4px;">
            <label class="mode-option" style="margin-bottom: 0;">
            <input type="checkbox" name="diet-tag" value="Gluten-Free" style="accent-color: var(--primary);">
              <span class="mode-name" style="font-size: 13px;">Gluten-Free</span>
            </label>
            <label class="mode-option" style="margin-bottom: 0; margin-left: 16px;">
              <input type="checkbox" name="diet-tag" value="Vegan" style="accent-color: var(--primary);">
              <span class="mode-name" style="font-size: 13px;">Vegan</span>
            </label>
            <label class="mode-option" style="margin-bottom: 0; margin-left: 16px;">
              <input type="checkbox" name="diet-tag" value="Vegetarian" style="accent-color: var(--primary);">
              <span class="mode-name" style="font-size: 13px;">Vegetarian</span>
              </label>
            <label class="mode-option" style="margin-bottom: 0; margin-left: 16px;">
              <input type="checkbox" name="diet-tag" value="Dairy-Free" style="accent-color: var(--primary);">
              <span class="mode-name" style="font-size: 13px;">Dairy-Free</span>
            </label>

            <label class="mode-option" style="margin-bottom: 0; margin-left: 16px;">
              <input type="checkbox" name="diet-tag" value="Low-Carb" style="accent-color: var(--primary);">
              <span class="mode-name" style="font-size: 13px;">Low-Carb</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="recipe-ingredients">Ingredients (One per line)</label>
          <span class="mode-desc" style="margin-bottom: 4px;">Format: [quantity] [unit] [ingredient name]. Example:<br/>1.5 cups flour<br/>2 cloves garlic<br/>3 slices bread</span>
          <textarea id="recipe-ingredients" class="form-textarea" placeholder="1.5 cups flour&#10;2 cloves garlic" required></textarea>
        </div>

        <div class="form-group">
          <label for="recipe-instructions">Cooking Steps (One per line)</label>
          <span class="mode-desc" style="margin-bottom: 4px;">Format: Write the instruction text for each step on a new line.</span>
          <textarea id="recipe-instructions" class="form-textarea" placeholder="Preheat oven to 350F&#10;Mix dry ingredients together" required></textarea>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px;">
          <button type="button" class="btn btn-secondary" id="creator-cancel">Cancel</button>
          <button type="submit" class="btn btn-accent">Save Recipe</button>
        </div>
      </form>
    </div>
  `;

    const form = modalOverlay.querySelector('#creator-form');
  const cancelBtn = modalOverlay.querySelector('#creator-cancel');

  const openCreator = () => {
    form.reset();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

    const closeCreator = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalOverlay.addEventListener('click', (e) => {
if (e.target === modalOverlay || e.target.closest('.modal-close') || e.target === cancelBtn) {
      closeCreator();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#recipe-name').value;
    const category = form.querySelector('#recipe-category').value;
    const difficulty = form.querySelector('#recipe-difficulty').value;
    const description = form.querySelector('#recipe-desc').value;
    const prepTime = parseInt(form.querySelector('#recipe-prep').value);
    const cookTime = parseInt(form.querySelector('#recipe-cook').value);
    const servings = parseInt(form.querySelector('#recipe-servings').value);

        // Get selected diets
    const checkedDiets = [];
    form.querySelectorAll('input[name="diet-tag"]:checked').forEach(chk => {
      checkedDiets.push(chk.value);
    });

    const ingredientsText = form.querySelector('#recipe-ingredients').value;
    const instructionsText = form.querySelector('#recipe-instructions').value;

    const ingredients = parseIngredientsText(ingredientsText);
    const instructions = parseInstructionsText(instructionsText);

    if (ingredients.length === 0) {