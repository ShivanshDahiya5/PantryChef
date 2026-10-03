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

    setMatchingMode(mode) {
    state.activeFilters = {
      ...state.activeFilters,
      matchingMode: mode
    };
    notify();
  },

    addCustomRecipe(recipe) {
    const newRecipe = {
      ...recipe,
      id: `custom-${Date.now()}`,
      rating: 5.0, // New recipe starts with a great rating!
      image: recipe.image || '/images/custom_placeholder.png'
    };
    state.customRecipes = [...state.customRecipes, newRecipe];
    saveCustomRecipes(state.customRecipes);
    notify();
  },

    deleteCustomRecipe(id) {
    state.customRecipes = state.customRecipes.filter(r => r.id !== id);
    saveCustomRecipes(state.customRecipes);
    notify();
  },

    // Core Filtering Engine
  getFilteredRecipes() {
    const allRecipes = [...defaultRecipes, ...state.customRecipes];
    const { category, dietary, sortBy, matchingMode } = state.activeFilters;
    const { pantryIngredients, searchQuery } = state;

        return allRecipes
      .filter(recipe => {
        // 1. Text Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = recipe.name.toLowerCase().includes(q);
          const descMatch = recipe.description.toLowerCase().includes(q);
          const ingredientsMatch = recipe.ingredients.some(i => i.name.toLowerCase().includes(q));
          if (!nameMatch && !descMatch && !ingredientsMatch) return false;
        }

        // 2. Category filter
        if (category !== 'All' && recipe.category !== category) {
          return false;
        }

        // 3. Dietary tag filter (All selected dietary tags must be met)
        if (dietary.length > 0) {
          const recipeTags = (recipe.tags || []).map(t => t.toLowerCase());
          const matchAllDiets = dietary.every(diet => 
            recipeTags.includes(diet.toLowerCase())
          );
          if (!matchAllDiets) return false;
        }

        // 4. Pantry Matching Filter
        if (pantryIngredients.length > 0) {
          // Calculate matching details
          const requiredIngredients = recipe.ingredients.filter(i => !i.optional);
          const matchedIngredientsCount = requiredIngredients.filter(i => 
            isIngredientMatched(i.name, pantryIngredients)
          ).length;

          const totalRequiredCount = requiredIngredients.length;
          const missingCount = totalRequiredCount - matchedIngredientsCount;

          if (matchingMode === 'all') {
            // Recipe must have all ingredients matched (missingCount === 0)
            if (missingCount > 0) return false;
          } else if (matchingMode === 'ready-to-cook') {
            // Recipe can have at most 2 missing ingredients
            if (missingCount > 2) return false;
          }
          }

        return true;
      })
      .sort((a, b) => {
        // If pantry is not empty, and matchingMode is 'any', sort primarily by ingredient match percentage
        if (pantryIngredients.length > 0) {
          const getMatchRatio = (recipe) => {
            const req = recipe.ingredients.filter(i => !i.optional);
            if (req.length === 0) return 0;
            const matched = req.filter(i => isIngredientMatched(i.name, pantryIngredients)).length;
            return matched / req.length;
          };

          const ratioA = getMatchRatio(a);
          const ratioB = getMatchRatio(b);

          if (ratioA !== ratioB) {
            return ratioB - ratioA; // Higher match ratio first
          }
        }

        // Secondary sorting based on active filters
        if (sortBy === 'rating') {
          return b.rating - a.rating;