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

    // Set card contents
    const cardElement = document.createElement('div');
    cardElement.className = 'recipe-card';
    cardElement.dataset.id = recipe.id;

    // Star rating rendering helper
    const renderStars = (rating) => {
        return `★ ${rating.toFixed(1)}`;
    };

    cardElement.innerHTML = `
    <div class="recipe-card-img-wrapper">
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-card-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60'"/>
    <span class="recipe-card-category">${recipe.category}</span>
      <span class="recipe-card-rating">${renderStars(recipe.rating)}</span>
      ${matchBadgeHtml}
      ${isCustom ? `<button class="custom-delete-btn" title="Delete recipe" data-action="delete">&times;</button>` : ''}
    </div>
    <div class="recipe-card-info">
      <h4 class="recipe-card-title">${recipe.name}</h4>
      <p class="recipe-card-desc">${recipe.description}</p>
      <div class="recipe-card-meta">
      <span class="recipe-card-meta-item">
          ⏱️ ${recipe.prepTime + recipe.cookTime} mins
        </span>
        <span class="recipe-card-meta-item">
          🍳 ${recipe.difficulty}
        </span>
      </div>
    </div>
  `;

    // Prevent card click when clicking the delete button
    cardElement.addEventListener('click', (e) => {
        const isDelete = e.target.closest('[data-action="delete"]');
        if (isDelete) {
            e.stopPropagation();
            onDeleteClick(recipe.id);
        } else {
            onCardClick(recipe);
        }
    });

    return cardElement;
}