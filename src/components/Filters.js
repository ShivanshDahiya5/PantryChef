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

                <!-- Sort drop down -->
        <div class="sort-group">
          <label for="recipe-sort">Sort by:</label>
          <select id="recipe-sort" class="sort-select">
            <option value="rating">Highest Rating</option>
            <option value="prepTime">Fastest Cook Time</option>
            <option value="difficulty">Easiest Difficulty</option>
          </select>
        </div>
      </div>
    </div>
  `;

    const searchInput = container.querySelector('#recipe-search');
  const categoryTabs = container.querySelectorAll('.category-tab');
  const dietaryBtns = container.querySelectorAll('.dietary-btn');
  const sortSelect = container.querySelector('#recipe-sort');

    // Search input change handler (debounced or simple input listener)
  searchInput.addEventListener('input', (e) => {
    store.setSearchQuery(e.target.value);
  });

    // Category tab click handlers
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      store.setCategory(tab.dataset.category);
    });
  });

    // Dietary filter buttons toggle handlers
  dietaryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      store.toggleDietary(btn.dataset.tag);
    });
  });
