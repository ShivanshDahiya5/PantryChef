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

    // Render match progress element if pantry is not empty
  let matchBadgeHtml = '';
  if (hasPantryItems) {
    const isReady = matchedCount === totalRequired;
    const progressColor = isReady ? 'var(--success)' : 'var(--accent)';
const progressText = isReady 
      ? 'Ready to cook!' 
      : `${matchedCount}/${totalRequired} ingredients`;
      
    matchBadgeHtml = `
      <div class="recipe-match-indicator">
        <span>${progressText}</span>
        <div class="recipe-match-progress-bar">
          <div class="recipe-match-progress-fill" style="width: ${matchPercentage}%; background-color: ${progressColor};"></div>
        </div>
      </div>
    `;
  }