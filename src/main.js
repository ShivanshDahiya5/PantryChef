import './style.css';
import { store } from './store.js';
import { initPantry } from './components/Pantry.js';
import { initFilters } from './components/Filters.js';
import { createRecipeCard } from './components/RecipeCard.js';
import { initRecipeDetail } from './components/RecipeDetail.js';
import { initRecipeCreator } from './components/RecipeCreator.js';
import { recipes } from './data/recipes.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mount layout containers
  const pantryContainer = document.getElementById('pantry-container');
  const filtersContainer = document.getElementById('filters-container');
  const recipeDetailModal = document.getElementById('recipe-detail-modal');
  const recipeCreatorModal = document.getElementById('recipe-creator-modal');
  const recipesGrid = document.getElementById('recipes-grid');

  // Initialize components
  initPantry(pantryContainer);
  initFilters(filtersContainer);
  const detailController = initRecipeDetail(recipeDetailModal);
  const creatorController = initRecipeCreator(recipeCreatorModal);
