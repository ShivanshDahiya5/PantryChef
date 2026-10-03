import { recipes as defaultRecipes } from './data/recipes.js';

// Load initial state from LocalStorage
const loadPantry = () => {
  try {
    const data = localStorage.getItem('pantrychef_pantry');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load pantry', e);
    return [];
  }
};

const loadCustomRecipes = () => {
  try {
    const data = localStorage.getItem('pantrychef_custom_recipes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load custom recipes', e);
    return [];
  }
};

const savePantry = (pantry) => {
  localStorage.setItem('pantrychef_pantry', JSON.stringify(pantry));
};

const saveCustomRecipes = (recipes) => {
  localStorage.setItem('pantrychef_custom_recipes', JSON.stringify(recipes));
};

// Initial state values
let state = {
  pantryIngredients: loadPantry(),
  customRecipes: loadCustomRecipes(),
  searchQuery: '',
  activeFilters: {
    category: 'All',
    dietary: [], // Array of active tags e.g. ['Gluten-Free']
    sortBy: 'rating', // 'rating', 'prepTime', 'difficulty'
    matchingMode: 'any' // 'any', 'all', 'ready-to-cook'
  }
};

// Subscription listeners
const listeners = new Set();

const notify = () => {
  listeners.forEach(listener => listener(state));
};

// Normalize and match ingredient names
export const isIngredientMatched = (recipeIngName, pantryList) => {
  if (!pantryList || pantryList.length === 0) return false;
  const name = recipeIngName.toLowerCase().trim();
  return pantryList.some(pantryIng => {
    const p = pantryIng.toLowerCase().trim();
    return name.includes(p) || p.includes(name);
  });
};

export const store = {
  getState() {
    return state;
  },

  subscribe(listener) {
    listeners.add(listener);
    // Call listener immediately with current state
    listener(state);
    return () => listeners.delete(listener);
  },

  addPantryIngredient(ingredient) {
    const trimmed = ingredient.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    
    // Avoid duplicates
    const exists = state.pantryIngredients.some(i => i.toLowerCase() === lower);
    if (!exists) {
      state.pantryIngredients = [...state.pantryIngredients, trimmed];
      savePantry(state.pantryIngredients);
      notify();
    }
  },

    removePantryIngredient(ingredient) {
    state.pantryIngredients = state.pantryIngredients.filter(
      i => i.toLowerCase() !== ingredient.toLowerCase()
    );
    savePantry(state.pantryIngredients);
    notify();
  },

  clearPantry() {
    state.pantryIngredients = [];
    savePantry(state.pantryIngredients);
    notify();
  },

  setSearchQuery(query) {
    state.searchQuery = query;
    notify();
  },

  setCategory(category) {
    state.activeFilters = {
      ...state.activeFilters,
      category
    };
    notify();
  },

    toggleDietary(tag) {
    const currentDiets = state.activeFilters.dietary;
    const index = currentDiets.indexOf(tag);
    let nextDiets;
    if (index > -1) {
      nextDiets = currentDiets.filter(t => t !== tag);
    } else {
      nextDiets = [...currentDiets, tag];
    }
    state.activeFilters = {
      ...state.activeFilters,
      dietary: nextDiets
    };
    notify();
  },

    setSortBy(sortBy) {
    state.activeFilters = {
      ...state.activeFilters,
      sortBy
    };
    notify();
  },
