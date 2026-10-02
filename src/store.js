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
