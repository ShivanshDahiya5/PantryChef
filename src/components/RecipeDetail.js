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
            <span>
              ${scaledQty ? `<span class="ingredient-quantity">${formatQuantity(scaledQty)}</span>` : ''}
              <span class="ingredient-unit">${ing.unit || ''}</span>
              <span class="ingredient-name">${ing.name}</span>
              ${ing.optional ? '<span class="text-light" style="font-size: 11px;">(optional)</span>' : ''}
            </span>
          </li>
        `;
      })
      .join('');

      // Renders interactive cooking steps
    const stepsHtml = currentRecipe.instructions
      .map((step, index) => `
        <li class="step-item" data-step="${index}">
          <div class="step-checkbox-wrapper">
            <input type="checkbox" class="step-checkbox" id="step-chk-${index}" />
            </div>
          <div class="step-content">
            <span class="step-number">Step ${index + 1}</span>
            <span class="step-text">${step}</span>
          </div>
        </li>
      `)
      .join('');

      contentWrapper.innerHTML = `
      <button class="modal-close" title="Close modal">&times;</button>
      <div class="modal-hero">
        <img src="${currentRecipe.image}" alt="${currentRecipe.name}" class="modal-hero-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=60'"/>
        <div class="modal-hero-overlay"></div>
        <div class="modal-hero-content">
          <span class="modal-category">${currentRecipe.category}</span>
          <h2 class="modal-title">${currentRecipe.name}</h2>
        </div>
      </div>

      <div class="modal-body">
        <p class="modal-desc">${currentRecipe.description}</p>
        
        <div class="modal-quick-info">
          <div class="quick-info-item">
            <span class="quick-info-label">Prep Time</span>
            <span class="quick-info-value">${currentRecipe.prepTime} mins</span>
          </div>
          <div class="quick-info-item">
            <span class="quick-info-label">Cook Time</span>
            <span class="quick-info-value">${currentRecipe.cookTime} mins</span>
          </div>
          <div class="quick-info-item">
            <span class="quick-info-label">Difficulty</span>
            <span class="quick-info-value">${currentRecipe.difficulty}</span>
          </div>
          <div class="quick-info-item">
          <span class="quick-info-label">Rating</span>
            <span class="quick-info-value">★ ${currentRecipe.rating.toFixed(1)}</span>
          </div>
        </div>

        <div class="modal-content-split">
          <!-- Left Column: Ingredients -->
          <div>
            <h3 class="modal-section-title">Ingredients</h3>

            <div class="servings-control">
              <span class="servings-label">Servings:</span>
              <div class="servings-buttons">
                <button class="servings-btn" id="servings-dec">-</button>
                <span class="servings-count" id="servings-display">${currentServings}</span>
                <button class="servings-btn" id="servings-inc">+</button>
              </div>
            </div>

            <ul class="modal-ingredients-list">
              ${ingredientsHtml}
            </ul>
          </div>

          <!-- Right Column: Instructions -->
          <div>
            <h3 class="modal-section-title">Preparation</h3>
            <ul class="modal-steps-list">
              ${stepsHtml}
            </ul>
          </div>
        </div>
      </div>
    `;