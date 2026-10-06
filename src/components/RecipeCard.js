import { isIngredientMatched } from '../store.js';

export function createRecipeCard(recipe, pantryIngredients, onCardClick, onDeleteClick) {
  const isCustom = recipe.id.startsWith('custom-');

    // Calculate ingredient match details
  const requiredIngredients = recipe.ingredients.filter(i => !i.optional);
  const matchedCount = requiredIngredients.filter(i => 
    isIngredientMatched(i.name, pantryIngredients)
  ).length;
