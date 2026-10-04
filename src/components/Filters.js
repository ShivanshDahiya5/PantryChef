import { store } from '../store.js';

export function initFilters(container) {
  container.innerHTML = `
    <div class="filters-panel">
      <!-- Search Input -->
      <div class="search-bar">
        <input 
          type="text" 
          id="recipe-search" 
          class="search-input" 
          placeholder="Search recipes, ingredients, keywords..."
        />
      </div>
