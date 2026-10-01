export const recipes = [
  {
    id: "tuscan-salmon",
    name: "Creamy Tuscan Garlic Salmon",
    description: "Pan-seared salmon fillets in a rich, creamy garlic sauce with fresh baby spinach and sun-dried tomatoes. A restaurant-quality dinner made in under 30 minutes.",
    category: "Dinner",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "Medium",
    rating: 4.9,
    image: "/images/tuscan_salmon.png",
    tags: ["Gluten-Free", "Low-Carb", "Keto"],
    ingredients: [
      { name: "salmon fillets", quantity: 2, unit: "pieces" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "garlic", quantity: 4, unit: "cloves" },
      { name: "cherry tomatoes", quantity: 1, unit: "cup" },
      { name: "baby spinach", quantity: 2, unit: "cups" },
      { name: "heavy cream", quantity: 0.75, unit: "cup" },
      { name: "parmesan cheese", quantity: 0.5, unit: "cup" },
      { name: "chicken broth", quantity: 0.25, unit: "cup" },
      { name: "salt", quantity: 0.5, unit: "tsp" },
      { name: "black pepper", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Season salmon fillets on both sides with salt and black pepper.",
      "Heat olive oil in a large skillet over medium-high heat. Sear salmon for 5 minutes on each side, or until golden and cooked to your liking. Remove from skillet and set aside.",
      "In the same skillet, add minced garlic and saute for 1 minute until fragrant. Add cherry tomatoes and cook until they start to burst.",
      "Pour in the chicken broth and heavy cream, bringing to a simmer. Reduce heat to low and stir in the parmesan cheese until the sauce thickens slightly.",
      "Add the baby spinach and let it wilt in the warm cream sauce.",
      "Return the salmon fillets to the skillet, spooning the rich cream sauce over them. Simmer for 2 minutes until heated through and serve hot."
    ]
  },
  {
    id: "avocado-toast",
    name: "Sourdough Avocado Toast with Poached Egg",
    description: "Crispy artisanal sourdough bread topped with creamy seasoned avocado, ripe cherry tomatoes, and a perfectly runny poached egg, garnished with microgreens and chili flakes.",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: "Easy",
    rating: 4.7,
    image: "/images/avocado_toast.png",
    tags: ["Vegetarian", "Dairy-Free"],
    ingredients: [
      { name: "sourdough bread", quantity: 1, unit: "slice" },
      { name: "ripe avocado", quantity: 1, unit: "whole" },
      { name: "egg", quantity: 1, unit: "whole" },
      { name: "lemon juice", quantity: 1, unit: "tsp" },
      { name: "cherry tomatoes", quantity: 4, unit: "pieces" },
      { name: "red pepper flakes", quantity: 0.25, unit: "tsp" },
      { name: "salt", quantity: 0.25, unit: "tsp" },
      { name: "black pepper", quantity: 0.25, unit: "tsp" },
      { name: "microgreens", quantity: 1, unit: "pinch", optional: true }
    ],
    instructions: [
      "Bring a small pot of water with a dash of vinegar to a gentle simmer. Crack the egg into a small cup, swirl the water, and gently slip the egg in. Poach for 3-4 minutes until the whites are set but the yolk is runny. Remove with a slotted spoon.",
      "Toast the slice of sourdough bread until crispy and golden brown.",
      "In a bowl, mash the avocado with lemon juice, salt, and black pepper to a chunky-smooth consistency.",
      "Spread the mashed avocado generously over the toasted sourdough.",
      "Slice the cherry tomatoes and place them on top of the avocado bed.",
      "Gently place the poached egg in the center. Sprinkle with red pepper flakes and microgreens if desired, and serve immediately."
    ]
  },