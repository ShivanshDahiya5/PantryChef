import { isIngredientMatched } from '../store.js';

export function createRecipeCard(recipe, pantryIngredients, onCardClick, onDeleteClick) {
  const isCustom = recipe.id.startsWith('custom-');

    // Calculate ingredient match details
  const requiredIngredients = recipe.ingredients.filter(i => !i.optional);
  const matchedCount = requiredIngredients.filter(i => 
    isIngredientMatched(i.name, pantryIngredients)
  ).length;

    const totalRequired = requiredIngredients.length;
  const matchPercentage = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0;
  
  const hasPantryItems = pantryIngredients && pantryIngredients.length > 0;
