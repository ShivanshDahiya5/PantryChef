import { store } from '../store.js';

export function initPantry(container) {
  container.innerHTML = `
    <div class="pantry-card">
      <h3>Your Pantry</h3>
      <p class="pantry-subtitle">Add the ingredients you have at home to see matching recipes.</p>

      <div class="pantry-input-wrapper">
        <div class="pantry-input-group">
          <input 
            type="text" 
            id="pantry-input" 
            class="pantry-input" 
            placeholder="Type ingredient (e.g. garlic)..." 
            autocomplete="off"
          />
          <button id="add-ingredient-btn" class="btn-icon" title="Add Ingredient">+</button>
        </div>
        <ul id="suggestions-list" class="suggestions-list" style="display: none;"></ul>
      </div>

      <div id="pantry-tags" class="pantry-tags"></div>
      <button id="clear-pantry-btn" class="clear-pantry-btn" style="display: none;">Clear all ingredients</button>

      <div class="pantry-modes">
        <h4>Matching Engine</h4>
        <label class="mode-option">
          <input type="radio" name="matching-mode" value="any" checked>
          <div class="mode-label">
            <span class="mode-name">Match Any</span>
            <span class="mode-desc">Show recipes containing any of these ingredients</span>
          </div>
        </label>
        <label class="mode-option">
          <input type="radio" name="matching-mode" value="ready-to-cook">
          <div class="mode-label">
            <span class="mode-name">Ready to Cook</span>
            <span class="mode-desc">Recipes missing at most 2 ingredients</span>
          </div>
        </label>
        <label class="mode-option">
          <input type="radio" name="matching-mode" value="all">
          <div class="mode-label">
            <span class="mode-name">Match All</span>
            <span class="mode-desc">Only show recipes you have all ingredients for</span>
          </div>
        </label>
      </div>
    </div>
  `;

    const input = container.querySelector('#pantry-input');
  const addBtn = container.querySelector('#add-ingredient-btn');
  const suggestionsList = container.querySelector('#suggestions-list');
  const tagsContainer = container.querySelector('#pantry-tags');
  const clearBtn = container.querySelector('#clear-pantry-btn');
  const modeRadios = container.querySelectorAll('input[name="matching-mode"]');

  let activeSuggestionIndex = -1;
  let currentSuggestions = [];

    const handleAddIngredient = (val) => {
    const ingredient = val || input.value;
    if (ingredient.trim()) {
      store.addPantryIngredient(ingredient);
      input.value = '';
      hideSuggestions();
    }
  };

    addBtn.addEventListener('click', () => handleAddIngredient());
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex > -1 && currentSuggestions[activeSuggestionIndex]) {
        handleAddIngredient(currentSuggestions[activeSuggestionIndex]);
      } else {
        handleAddIngredient();
      }
} else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentSuggestions.length > 0) {
        activeSuggestionIndex = (activeSuggestionIndex + 1) % currentSuggestions.length;
        renderSuggestions();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentSuggestions.length > 0) {
        activeSuggestionIndex = (activeSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
        renderSuggestions();
      }
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

    input.addEventListener('input', () => {
    const val = input.value.toLowerCase().trim();
    if (!val) {
      hideSuggestions();
      return;
    }

    const allIngs = store.getAllIngredients();
    const ownedIngs = store.getState().pantryIngredients.map(i => i.toLowerCase());

        // Find ingredients containing search query, not already owned
    currentSuggestions = allIngs.filter(ing => 
      ing.includes(val) && !ownedIngs.includes(ing)
    ).slice(0, 6); // Limit to 6 suggestions

    activeSuggestionIndex = -1;
    renderSuggestions();
  });

    // Hide suggestions list
  const hideSuggestions = () => {
    suggestionsList.style.display = 'none';
    suggestionsList.innerHTML = '';
    currentSuggestions = [];
    activeSuggestionIndex = -1;
  };

    // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
      hideSuggestions();
    }
  });

    // Render suggestions UI
  const renderSuggestions = () => {
    if (currentSuggestions.length === 0) {
      suggestionsList.style.display = 'none';
      return;
    }

    suggestionsList.innerHTML = currentSuggestions
