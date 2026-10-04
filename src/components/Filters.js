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

            <!-- Category Tabs -->
      <div id="category-tabs" class="category-tabs">
        <button class="category-tab active" data-category="All">All Recipes</button>
        <button class="category-tab" data-category="Breakfast">Breakfast</button>
        <button class="category-tab" data-category="Lunch">Lunch</button>
        <button class="category-tab" data-category="Dinner">Dinner</button>
        <button class="category-tab" data-category="Dessert">Dessert</button>
        <button class="category-tab" data-category="Snack">Snacks</button>
      </div>

            <!-- Dietary and Sorting row -->
      <div class="filter-row">
        <!-- Dietary requirements pill list -->
        <div id="dietary-filters" class="dietary-filters">
          <button class="dietary-btn" data-tag="Gluten-Free">Gluten-Free</button>
          <button class="dietary-btn" data-tag="Vegan">Vegan</button>
          <button class="dietary-btn" data-tag="Vegetarian">Vegetarian</button>
          <button class="dietary-btn" data-tag="Dairy-Free">Dairy-Free</button>
          <button class="dietary-btn" data-tag="Low-Carb">Low-Carb</button>
        </div>
