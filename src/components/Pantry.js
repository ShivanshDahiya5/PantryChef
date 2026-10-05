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