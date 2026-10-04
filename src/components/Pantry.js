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