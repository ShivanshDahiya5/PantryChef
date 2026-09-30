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

    // 2. Wire up Creator Modal triggers
  const addCustomBtn = document.getElementById('add-custom-btn');
  addCustomBtn.addEventListener('click', () => {
    creatorController.openCreator();
  });

  // 3. Setup Featured Recipe (Tuscan Salmon) in Hero Section
  const featuredRecipe = recipes.find(r => r.id === 'tuscan-salmon');
  if (featuredRecipe) {
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroTime = document.getElementById('hero-time');
    const heroDifficulty = document.getElementById('hero-difficulty');
    const heroRating = document.getElementById('hero-rating');
    const heroViewBtn = document.getElementById('hero-view-btn');

    heroTitle.textContent = featuredRecipe.name;
    heroDesc.textContent = featuredRecipe.description;
    heroTime.textContent = `${featuredRecipe.prepTime + featuredRecipe.cookTime} mins`;
    heroDifficulty.textContent = featuredRecipe.difficulty;
    heroRating.textContent = featuredRecipe.rating.toFixed(1);

    heroViewBtn.addEventListener('click', () => {
      detailController.openRecipe(featuredRecipe);
    });
  }