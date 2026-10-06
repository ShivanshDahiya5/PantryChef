import { isIngredientMatched } from '../store.js';

export function createRecipeCard(recipe, pantryIngredients, onCardClick, onDeleteClick) {
  const isCustom = recipe.id.startsWith('custom-');
