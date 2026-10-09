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
else if (Math.abs(frac - 0.67) < 0.05) fracText = '2/3';
  else if (Math.abs(frac - 0.125) < 0.03) fracText = '1/8';
  else if (frac > 0) {
    // If it's a decimal, trim trailing zeros
    fracText = frac.toFixed(2).replace(/\.?0+$/, '').substring(1);
  }

  if (whole > 0) {
    return fracText ? `${whole}${fracText.startsWith('.') ? fracText : ' ' + fracText}` : `${whole}`;
  }
  return fracText || `${val}`;
}

export function initRecipeDetail(modalContainer) {
  let currentRecipe = null;
  let currentServings = 2;

  // Render modal structure shell
  modalContainer.innerHTML = `

  <div class="modal-container" id="modal-content-wrapper">
      <!-- Content loaded dynamically -->
    </div>
  `;

  const contentWrapper = modalContainer.querySelector('#modal-content-wrapper');

  // Close modal logic
  const closeModal = () => {
    modalContainer.classList.remove('active');
    currentRecipe = null;
    document.body.style.overflow = ''; // Restore scroll
  };

  modalContainer.addEventListener('click', (e) => {
    // Close on clicking the background overlay or close button
    if (e.target === modalContainer || e.target.closest('.modal-close')) {
      closeModal();
    }
  });

   // Dynamic content renderer
  const renderRecipeDetails = () => {
    if (!currentRecipe) return;

    const scaleFactor = currentServings / currentRecipe.servings;
    const pantryIngredients = store.getState().pantryIngredients;

    // Renders ingredients list with highlighting
    const ingredientsHtml = currentRecipe.ingredients
    .map(ing => {
        const isMatched = isIngredientMatched(ing.name, pantryIngredients);
        const scaledQty = ing.quantity ? ing.quantity * scaleFactor : null;
        
        return `
          <li class="ingredient-item ${isMatched ? 'owned' : 'missing'}">
            <input type="checkbox" class="ingredient-item-checkbox" ${isMatched ? 'checked' : ''} disabled />