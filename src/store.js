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
