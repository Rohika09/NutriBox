// NutriBox - Personalized Meal Builder JavaScript

// Global variables
let userNutrition = {
  protein: 0,
  calories: 0,
  carbs: 0,
  fat: 0
};

let selectedMeals = [];
let cart = [];
let currentCategory = 'all';
let selectedIngredients = [];
let customMeals = [];

// Global variables for search functionality
let currentMealCategory = 'all';
let currentIngredientCategory = 'all';
let filteredMeals = [];
let filteredIngredients = [];

// Additional real-world features
let mealPlan = [];
let nutritionHistory = [];
let dietaryRestrictions = [];

// Ingredient expand/collapse functionality
let ingredientsExpanded = false;
let initialIngredientsShown = 12; // Show first 12 ingredients initially

// Animation utility functions
function createFoodParticles(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#22c55e', '#16a34a', '#4ade80', '#fbbf24', '#f59e0b'];
  
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'food-particle';
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

function addFoodLoadingAnimation(element) {
  element.innerHTML = `
    <div class="text-center">
      <div class="food-loading"></div>
      <p class="text-sm text-gray-600 mt-2">Loading delicious meals...</p>
    </div>
  `;
}

function animateFoodIcon(iconElement) {
  iconElement.style.animation = 'foodPulse 0.6s ease-out';
  setTimeout(() => {
    iconElement.style.animation = '';
  }, 600);
}

// Meal database with regional variations
const mealDatabase = {
  indian: {
    protein: [
      { name: "Tandoori Chicken", protein: 25, calories: 180, carbs: 2, fat: 8, ingredients: "Chicken, yogurt, spices", category: "protein" },
      { name: "Paneer Tikka", protein: 21, calories: 220, carbs: 8, fat: 12, ingredients: "Paneer, spices, vegetables", category: "protein" },
      { name: "Dal Makhani", protein: 12, calories: 160, carbs: 25, fat: 4, ingredients: "Black lentils, spices, cream", category: "protein" },
      { name: "Chickpea Curry", protein: 15, calories: 200, carbs: 30, fat: 6, ingredients: "Chickpeas, tomatoes, spices", category: "protein" },
      { name: "Chicken Biryani", protein: 22, calories: 320, carbs: 45, fat: 10, ingredients: "Chicken, rice, spices", category: "protein" },
      { name: "Fish Curry", protein: 23, calories: 210, carbs: 5, fat: 9, ingredients: "Fish, coconut milk, spices", category: "protein" }
    ],
    carbs: [
      { name: "Basmati Rice", protein: 4, calories: 150, carbs: 35, fat: 0, ingredients: "Basmati rice, spices", category: "carbs" },
      { name: "Roti", protein: 3, calories: 120, carbs: 25, fat: 2, ingredients: "Whole wheat flour, water", category: "carbs" },
      { name: "Naan", protein: 4, calories: 180, carbs: 30, fat: 4, ingredients: "Flour, yogurt, yeast", category: "carbs" },
      { name: "Jeera Rice", protein: 3, calories: 160, carbs: 36, fat: 2, ingredients: "Basmati rice, cumin, ghee", category: "carbs" },
      { name: "Idli", protein: 2, calories: 40, carbs: 8, fat: 0, ingredients: "Rice, urad dal", category: "carbs" }
    ],
    vegetables: [
      { name: "Palak Paneer", protein: 8, calories: 140, carbs: 8, fat: 10, ingredients: "Spinach, paneer, spices", category: "vegetables" },
      { name: "Baingan Bharta", protein: 3, calories: 80, carbs: 12, fat: 3, ingredients: "Eggplant, onions, tomatoes", category: "vegetables" },
      { name: "Mixed Vegetables", protein: 4, calories: 100, carbs: 15, fat: 2, ingredients: "Carrots, peas, beans", category: "vegetables" },
      { name: "Aloo Gobi", protein: 4, calories: 150, carbs: 20, fat: 6, ingredients: "Potato, cauliflower, spices", category: "vegetables" },
      { name: "Bhindi Masala", protein: 2, calories: 90, carbs: 10, fat: 4, ingredients: "Okra, onions, spices", category: "vegetables" }
    ],
    fruits: [
      { name: "Mango Chutney", protein: 1, calories: 60, carbs: 15, fat: 0, ingredients: "Mango, spices, sugar", category: "fruits" },
      { name: "Mixed Fruit Salad", protein: 2, calories: 80, carbs: 18, fat: 0, ingredients: "Apple, banana, orange", category: "fruits" },
      { name: "Papaya Salad", protein: 1, calories: 70, carbs: 18, fat: 0, ingredients: "Papaya, lime, spices", category: "fruits" }
    ]
  },
  mediterranean: {
    protein: [
      { name: "Grilled Salmon", protein: 28, calories: 220, carbs: 0, fat: 12, ingredients: "Salmon, olive oil, herbs", category: "protein" },
      { name: "Greek Yogurt", protein: 20, calories: 150, carbs: 8, fat: 4, ingredients: "Greek yogurt, honey", category: "protein" },
      { name: "Hummus", protein: 8, calories: 120, carbs: 15, fat: 6, ingredients: "Chickpeas, tahini, olive oil", category: "protein" },
      { name: "Stuffed Eggplant", protein: 6, calories: 180, carbs: 14, fat: 10, ingredients: "Eggplant, tomatoes, herbs", category: "protein" },
      { name: "Lentil Soup", protein: 10, calories: 140, carbs: 20, fat: 3, ingredients: "Lentils, vegetables, olive oil", category: "protein" }
    ],
    carbs: [
      { name: "Quinoa Salad", protein: 6, calories: 140, carbs: 25, fat: 3, ingredients: "Quinoa, vegetables, olive oil", category: "carbs" },
      { name: "Whole Grain Pita", protein: 4, calories: 130, carbs: 28, fat: 2, ingredients: "Whole wheat flour, yeast", category: "carbs" },
      { name: "Couscous", protein: 5, calories: 160, carbs: 33, fat: 1, ingredients: "Semolina, vegetables", category: "carbs" },
      { name: "Farro Salad", protein: 7, calories: 170, carbs: 30, fat: 4, ingredients: "Farro, herbs, olive oil", category: "carbs" }
    ],
    vegetables: [
      { name: "Greek Salad", protein: 4, calories: 90, carbs: 8, fat: 6, ingredients: "Cucumber, tomatoes, olives, feta", category: "vegetables" },
      { name: "Ratatouille", protein: 3, calories: 110, carbs: 12, fat: 4, ingredients: "Eggplant, zucchini, tomatoes", category: "vegetables" },
      { name: "Grilled Veg Skewers", protein: 3, calories: 120, carbs: 10, fat: 5, ingredients: "Peppers, zucchini, mushrooms", category: "vegetables" }
    ],
    fruits: [
      { name: "Fresh Figs", protein: 1, calories: 70, carbs: 18, fat: 0, ingredients: "Fresh figs", category: "fruits" },
      { name: "Mediterranean Fruit Mix", protein: 2, calories: 85, carbs: 20, fat: 0, ingredients: "Grapes, oranges, pomegranate", category: "fruits" },
      { name: "Orange Slices with Honey", protein: 1, calories: 90, carbs: 22, fat: 0, ingredients: "Orange, honey", category: "fruits" }
    ]
  },
  asian: {
    protein: [
      { name: "Teriyaki Chicken", protein: 26, calories: 200, carbs: 8, fat: 8, ingredients: "Chicken, soy sauce, ginger", category: "protein" },
      { name: "Tofu Stir Fry", protein: 18, calories: 160, carbs: 12, fat: 6, ingredients: "Tofu, vegetables, soy sauce", category: "protein" },
      { name: "Steamed Fish", protein: 24, calories: 180, carbs: 2, fat: 6, ingredients: "White fish, ginger, soy sauce", category: "protein" },
      { name: "Korean BBQ Beef", protein: 28, calories: 260, carbs: 6, fat: 10, ingredients: "Beef, gochujang, garlic", category: "protein" },
      { name: "Sushi Roll", protein: 12, calories: 200, carbs: 28, fat: 4, ingredients: "Rice, fish, seaweed", category: "protein" }
    ],
    carbs: [
      { name: "Brown Rice", protein: 3, calories: 110, carbs: 23, fat: 1, ingredients: "Brown rice", category: "carbs" },
      { name: "Noodles", protein: 4, calories: 140, carbs: 28, fat: 2, ingredients: "Wheat noodles, vegetables", category: "carbs" },
      { name: "Sticky Rice", protein: 3, calories: 160, carbs: 36, fat: 0, ingredients: "Glutinous rice", category: "carbs" },
      { name: "Udon Noodles", protein: 6, calories: 180, carbs: 35, fat: 2, ingredients: "Udon, broth", category: "carbs" }
    ],
    vegetables: [
      { name: "Stir Fried Vegetables", protein: 3, calories: 80, carbs: 10, fat: 2, ingredients: "Bok choy, mushrooms, carrots", category: "vegetables" },
      { name: "Seaweed Salad", protein: 2, calories: 60, carbs: 8, fat: 1, ingredients: "Seaweed, sesame oil, vinegar", category: "vegetables" },
      { name: "Kimchi", protein: 2, calories: 30, carbs: 5, fat: 0, ingredients: "Napa cabbage, chili, garlic", category: "vegetables" },
      { name: "Bok Choy Stir Fry", protein: 3, calories: 70, carbs: 6, fat: 2, ingredients: "Bok choy, garlic, soy", category: "vegetables" }
    ],
    fruits: [
      { name: "Lychee", protein: 1, calories: 65, carbs: 16, fat: 0, ingredients: "Fresh lychee", category: "fruits" },
      { name: "Asian Pear", protein: 1, calories: 55, carbs: 14, fat: 0, ingredients: "Asian pear", category: "fruits" },
      { name: "Mango Sticky Rice", protein: 4, calories: 250, carbs: 50, fat: 6, ingredients: "Mango, sticky rice, coconut milk", category: "fruits" }
    ]
  },
  western: {
    protein: [
      { name: "Grilled Chicken Breast", protein: 30, calories: 180, carbs: 0, fat: 4, ingredients: "Chicken breast, herbs, olive oil", category: "protein" },
      { name: "Lean Beef Steak", protein: 32, calories: 220, carbs: 0, fat: 8, ingredients: "Beef, herbs, garlic", category: "protein" },
      { name: "Eggs Benedict", protein: 16, calories: 200, carbs: 8, fat: 12, ingredients: "Eggs, ham, hollandaise", category: "protein" },
      { name: "Turkey Sandwich", protein: 22, calories: 320, carbs: 34, fat: 8, ingredients: "Turkey, bread, veggies", category: "protein" },
      { name: "BBQ Pulled Pork", protein: 24, calories: 350, carbs: 10, fat: 18, ingredients: "Pork, BBQ sauce", category: "protein" }
    ],
    carbs: [
      { name: "Sweet Potato", protein: 2, calories: 100, carbs: 23, fat: 0, ingredients: "Sweet potato, herbs", category: "carbs" },
      { name: "Whole Grain Bread", protein: 4, calories: 120, carbs: 22, fat: 2, ingredients: "Whole wheat flour, seeds", category: "carbs" },
      { name: "Pancakes", protein: 6, calories: 220, carbs: 38, fat: 6, ingredients: "Flour, eggs, milk", category: "carbs" },
      { name: "Mashed Potatoes", protein: 3, calories: 150, carbs: 20, fat: 6, ingredients: "Potatoes, butter, milk", category: "carbs" }
    ],
    vegetables: [
      { name: "Roasted Vegetables", protein: 3, calories: 90, carbs: 12, fat: 3, ingredients: "Broccoli, carrots, bell peppers", category: "vegetables" },
      { name: "Caesar Salad", protein: 4, calories: 110, carbs: 8, fat: 6, ingredients: "Romaine lettuce, parmesan, croutons", category: "vegetables" },
      { name: "Steamed Asparagus", protein: 2, calories: 30, carbs: 3, fat: 0, ingredients: "Asparagus, lemon", category: "vegetables" }
    ],
    fruits: [
      { name: "Berry Mix", protein: 2, calories: 70, carbs: 16, fat: 0, ingredients: "Strawberries, blueberries, raspberries", category: "fruits" },
      { name: "Apple Slices", protein: 1, calories: 60, carbs: 15, fat: 0, ingredients: "Fresh apple", category: "fruits" },
      { name: "Fruit Parfait", protein: 6, calories: 160, carbs: 24, fat: 4, ingredients: "Yogurt, berries, granola", category: "fruits" }
    ]
  }
};

// Comprehensive ingredient database for custom meal builder
const ingredientDatabase = {
  proteins: [
    { name: "Chicken Breast", protein: 31, calories: 165, carbs: 0, fat: 3.6, serving: "100g", category: "proteins" },
    { name: "Salmon", protein: 25, calories: 208, carbs: 0, fat: 12, serving: "100g", category: "proteins" },
    { name: "Tuna", protein: 30, calories: 144, carbs: 0, fat: 1, serving: "100g", category: "proteins" },
    { name: "Eggs", protein: 13, calories: 155, carbs: 1.1, fat: 11, serving: "2 large", category: "proteins" },
    { name: "Tofu", protein: 8, calories: 76, carbs: 1.9, fat: 4.8, serving: "100g", category: "proteins" },
    { name: "Paneer", protein: 18, calories: 265, carbs: 1.2, fat: 20, serving: "100g", category: "proteins" },
    { name: "Chickpeas", protein: 9, calories: 164, carbs: 27, fat: 2.6, serving: "100g", category: "proteins" },
    { name: "Lentils", protein: 9, calories: 116, carbs: 20, fat: 0.4, serving: "100g", category: "proteins" },
    { name: "Greek Yogurt", protein: 10, calories: 59, carbs: 3.6, fat: 0.4, serving: "100g", category: "proteins" },
    { name: "Cottage Cheese", protein: 11, calories: 98, carbs: 3.4, fat: 4.3, serving: "100g", category: "proteins" }
  ],
  vegetables: [
    { name: "Spinach", protein: 2.9, calories: 23, carbs: 3.6, fat: 0.4, serving: "100g", category: "vegetables" },
    { name: "Broccoli", protein: 2.8, calories: 34, carbs: 7, fat: 0.4, serving: "100g", category: "vegetables" },
    { name: "Kale", protein: 4.3, calories: 49, carbs: 8.8, fat: 0.9, serving: "100g", category: "vegetables" },
    { name: "Bell Peppers", protein: 1, calories: 31, carbs: 7, fat: 0.3, serving: "100g", category: "vegetables" },
    { name: "Carrots", protein: 0.9, calories: 41, carbs: 10, fat: 0.2, serving: "100g", category: "vegetables" },
    { name: "Cucumber", protein: 0.7, calories: 16, carbs: 3.6, fat: 0.1, serving: "100g", category: "vegetables" },
    { name: "Tomatoes", protein: 0.9, calories: 18, carbs: 3.9, fat: 0.2, serving: "100g", category: "vegetables" },
    { name: "Onions", protein: 1.1, calories: 40, carbs: 9.3, fat: 0.1, serving: "100g", category: "vegetables" },
    { name: "Mushrooms", protein: 3.1, calories: 22, carbs: 3.3, fat: 0.3, serving: "100g", category: "vegetables" },
    { name: "Zucchini", protein: 1.2, calories: 17, carbs: 3.1, fat: 0.3, serving: "100g", category: "vegetables" }
  ],
  fruits: [
    { name: "Apple", protein: 0.3, calories: 52, carbs: 14, fat: 0.2, serving: "1 medium", category: "fruits" },
    { name: "Banana", protein: 1.1, calories: 89, carbs: 23, fat: 0.3, serving: "1 medium", category: "fruits" },
    { name: "Strawberries", protein: 0.7, calories: 32, carbs: 8, fat: 0.3, serving: "100g", category: "fruits" },
    { name: "Blueberries", protein: 0.7, calories: 57, carbs: 14, fat: 0.3, serving: "100g", category: "fruits" },
    { name: "Orange", protein: 0.9, calories: 47, carbs: 12, fat: 0.1, serving: "1 medium", category: "fruits" },
    { name: "Grapes", protein: 0.6, calories: 62, carbs: 16, fat: 0.2, serving: "100g", category: "fruits" },
    { name: "Mango", protein: 0.8, calories: 60, carbs: 15, fat: 0.4, serving: "100g", category: "fruits" },
    { name: "Pineapple", protein: 0.5, calories: 50, carbs: 13, fat: 0.1, serving: "100g", category: "fruits" },
    { name: "Kiwi", protein: 1.1, calories: 61, carbs: 15, fat: 0.5, serving: "1 medium", category: "fruits" },
    { name: "Avocado", protein: 2, calories: 160, carbs: 9, fat: 15, serving: "100g", category: "fruits" }
  ],
  grains: [
    { name: "Quinoa", protein: 4.4, calories: 120, carbs: 22, fat: 1.9, serving: "100g", category: "grains" },
    { name: "Brown Rice", protein: 2.6, calories: 111, carbs: 23, fat: 0.9, serving: "100g", category: "grains" },
    { name: "Oats", protein: 6.9, calories: 68, carbs: 12, fat: 1.4, serving: "100g", category: "grains" },
    { name: "Whole Wheat Bread", protein: 4.2, calories: 247, carbs: 41, fat: 4.2, serving: "100g", category: "grains" },
    { name: "Sweet Potato", protein: 1.6, calories: 86, carbs: 20, fat: 0.1, serving: "100g", category: "grains" },
    { name: "Pasta", protein: 5.8, calories: 131, carbs: 25, fat: 1.1, serving: "100g", category: "grains" },
    { name: "Barley", protein: 2.3, calories: 73, carbs: 15, fat: 0.5, serving: "100g", category: "grains" },
    { name: "Bulgur", protein: 3.1, calories: 83, carbs: 18, fat: 0.2, serving: "100g", category: "grains" },
    { name: "Millet", protein: 3.5, calories: 119, carbs: 23, fat: 1, serving: "100g", category: "grains" },
    { name: "Buckwheat", protein: 3.4, calories: 92, carbs: 20, fat: 0.6, serving: "100g", category: "grains" }
  ],
  dairy: [
    { name: "Milk", protein: 3.4, calories: 42, carbs: 5, fat: 1, serving: "100ml", category: "dairy" },
    { name: "Cheese", protein: 25, calories: 402, carbs: 1.3, fat: 33, serving: "100g", category: "dairy" },
    { name: "Butter", protein: 0.9, calories: 717, carbs: 0.1, fat: 81, serving: "100g", category: "dairy" },
    { name: "Cream", protein: 2.1, calories: 340, carbs: 2.8, fat: 37, serving: "100g", category: "dairy" },
    { name: "Yogurt", protein: 3.5, calories: 59, carbs: 3.6, fat: 3.3, serving: "100g", category: "dairy" },
    { name: "Sour Cream", protein: 2.4, calories: 198, carbs: 4.3, fat: 19, serving: "100g", category: "dairy" },
    { name: "Ice Cream", protein: 3.5, calories: 207, carbs: 24, fat: 11, serving: "100g", category: "dairy" },
    { name: "Cream Cheese", protein: 5.9, calories: 342, carbs: 4.1, fat: 34, serving: "100g", category: "dairy" },
    { name: "Ricotta", protein: 11, calories: 174, carbs: 3, fat: 13, serving: "100g", category: "dairy" },
    { name: "Feta", protein: 14, calories: 264, carbs: 4.1, fat: 21, serving: "100g", category: "dairy" }
  ],
  nuts: [
    { name: "Almonds", protein: 21, calories: 579, carbs: 22, fat: 50, serving: "100g", category: "nuts" },
    { name: "Walnuts", protein: 15, calories: 654, carbs: 14, fat: 65, serving: "100g", category: "nuts" },
    { name: "Cashews", protein: 18, calories: 553, carbs: 30, fat: 44, serving: "100g", category: "nuts" },
    { name: "Pistachios", protein: 20, calories: 560, carbs: 28, fat: 45, serving: "100g", category: "nuts" },
    { name: "Pecans", protein: 9, calories: 691, carbs: 14, fat: 72, serving: "100g", category: "nuts" },
    { name: "Sunflower Seeds", protein: 21, calories: 584, carbs: 20, fat: 51, serving: "100g", category: "nuts" },
    { name: "Pumpkin Seeds", protein: 19, calories: 559, carbs: 54, fat: 19, serving: "100g", category: "nuts" },
    { name: "Chia Seeds", protein: 17, calories: 486, carbs: 42, fat: 31, serving: "100g", category: "nuts" },
    { name: "Flax Seeds", protein: 18, calories: 534, carbs: 29, fat: 42, serving: "100g", category: "nuts" },
    { name: "Peanuts", protein: 26, calories: 567, carbs: 16, fat: 49, serving: "100g", category: "nuts" }
  ],
  dressings: [
    { name: "Olive Oil", protein: 0, calories: 884, carbs: 0, fat: 100, serving: "100ml", category: "dressings" },
    { name: "Balsamic Vinegar", protein: 0, calories: 88, carbs: 17, fat: 0, serving: "100ml", category: "dressings" },
    { name: "Lemon Juice", protein: 0.4, calories: 22, carbs: 7, fat: 0.2, serving: "100ml", category: "dressings" },
    { name: "Honey", protein: 0.3, calories: 304, carbs: 82, fat: 0, serving: "100g", category: "dressings" },
    { name: "Mustard", protein: 5.7, calories: 66, carbs: 5.8, fat: 4.4, serving: "100g", category: "dressings" },
    { name: "Mayonnaise", protein: 1, calories: 680, carbs: 0.6, fat: 75, serving: "100g", category: "dressings" },
    { name: "Soy Sauce", protein: 8.1, calories: 60, carbs: 5.6, fat: 0.1, serving: "100ml", category: "dressings" },
    { name: "Hot Sauce", protein: 0.5, calories: 15, carbs: 3.2, fat: 0.2, serving: "100ml", category: "dressings" },
    { name: "Tahini", protein: 17, calories: 595, carbs: 18, fat: 54, serving: "100g", category: "dressings" },
    { name: "Sriracha", protein: 0.8, calories: 15, carbs: 3.2, fat: 0.2, serving: "100ml", category: "dressings" }
  ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Set up event listeners
  setupEventListeners();

  // Ensure notification container is fixed to viewport so notifications
  // remain visible regardless of scroll or transformed ancestors.
  (function ensureNotificationContainer() {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    // Move to body root to avoid being inside a transformed/scrolling parent
    if (container.parentElement !== document.body) document.body.appendChild(container);
    // Force fixed positioning in the viewport and high z-index
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '99999';
    container.style.overflow = 'visible';
    container.style.pointerEvents = 'auto';
  })();
  
  // Set minimum date for delivery to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('deliveryDate').min = tomorrow.toISOString().split('T')[0];
  
  // Show welcome animation with food theme
  setTimeout(() => {
    const welcomeTitle = document.querySelector('h1');
    const welcomeSubtitle = document.querySelector('h2');
    
    if (welcomeTitle) {
      welcomeTitle.classList.add('food-success');
      welcomeTitle.innerHTML = 'Welcome to NUTREEBOX 🍎🥕🍗';
    }
    
    if (welcomeSubtitle) {
      setTimeout(() => {
        welcomeSubtitle.classList.add('food-success');
        welcomeSubtitle.innerHTML = 'Your Personalized Nutrition Journey 🌱💪';
      }, 300);
    }
    
    // Animate floating food icons
    document.querySelectorAll('.floating-food').forEach((icon, index) => {
      setTimeout(() => {
        icon.style.opacity = '0.1';
        icon.style.animation = 'float 6s ease-in-out infinite';
      }, index * 200);
    });
  }, 500);
}

function setupEventListeners() {
  // Cart button
  document.getElementById('cartBtn').addEventListener('click', openCart);
  
  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;
      currentCategory = category;
      const searchTerm = document.getElementById('mealSearch')?.value || '';
      filterMeals(searchTerm);
      
      // Update active button
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Ingredient category buttons
  document.querySelectorAll('.ingredient-category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;
      loadIngredients(category);
      
      // Update active button
      document.querySelectorAll('.ingredient-category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Option selection
  document.querySelectorAll('.region-option, .diet-option, .goal-option').forEach(option => {
    option.addEventListener('change', function() {
      this.querySelector('div').classList.add('selected');
    });
  });

  // Add search functionality
  const mealSearch = document.getElementById('mealSearch');
  const ingredientSearch = document.getElementById('ingredientSearch');
  
  if (mealSearch) {
    mealSearch.addEventListener('input', (e) => {
      filterMeals(e.target.value);
    });
  }
  
  if (ingredientSearch) {
    ingredientSearch.addEventListener('input', (e) => {
      filterIngredients(e.target.value);
    });
  }
}

function calculateNutrition() {
  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const activity = parseFloat(document.getElementById("activity").value);

  if (!age || !height || !weight) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Male formula
  const tdee = bmr * activity;

  // Calculate macronutrients based on weight and goals
  const protein = Math.round(weight * 1.6); // 1.6g per kg for active individuals
  const fat = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
  const carbs = Math.round((tdee - (protein * 4) - (fat * 9)) / 4); // Remaining calories from carbs

  // Store user nutrition data
  userNutrition = {
    protein: protein,
    calories: Math.round(tdee),
    carbs: carbs,
    fat: fat
  };

  // Update UI
  document.getElementById("proteinValue").textContent = protein;
  document.getElementById("caloriesValue").textContent = Math.round(tdee);
  document.getElementById("carbsValue").textContent = carbs;
  document.getElementById("fatValue").textContent = fat;

  // Show results and preferences section
  document.getElementById("nutritionResults").classList.remove("hidden");
  document.getElementById("preferencesSection").classList.remove("hidden");

  // Update target values in meal builder
  document.getElementById("targetProtein").textContent = protein;
  document.getElementById("targetCalories").textContent = Math.round(tdee);

  showNotification('Nutrition calculation completed!', 'success');
}

function showMealBuilder() {
  const region = document.querySelector('input[name="region"]:checked')?.value;
  const diet = document.querySelector('input[name="diet"]:checked')?.value;
  const goal = document.querySelector('input[name="goal"]:checked')?.value;

  if (!region || !diet || !goal) {
    showNotification('Please select all preferences', 'error');
    return;
  }

  // Store user preferences
  localStorage.setItem('userPreferences', JSON.stringify({ region, diet, goal }));

  // Show builder navigation
  document.getElementById("builderNavigation").classList.remove("hidden");
  
  // Show meal builder
  document.getElementById("mealBuilder").classList.remove("hidden");
  document.getElementById("customMealBuilder").classList.add("hidden");
  
  // Load meals based on region
  loadMeals(region, diet);
  
  showNotification('Meal builder loaded!', 'success');
}

function showCustomMealBuilder() {
  // Hide regular meal builder and show custom builder
  document.getElementById("mealBuilder").classList.add("hidden");
  document.getElementById("customMealBuilder").classList.remove("hidden");
  
  // Load all ingredients
  loadIngredients('all');
  
  showNotification('Custom meal builder loaded!', 'success');
}

function loadMeals(region, diet) {
  const mealGrid = document.getElementById('mealGrid');
  
  // Add loading animation
  addFoodLoadingAnimation(mealGrid);
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    mealGrid.innerHTML = '';

    const meals = mealDatabase[region];
    if (!meals) return;

    // Combine all meals and filter by diet
    let allMeals = [];
    Object.values(meals).forEach(category => {
      allMeals = allMeals.concat(category);
    });

    // Filter by dietary preference
    if (diet === 'vegetarian') {
      allMeals = allMeals.filter(meal => 
        !meal.name.toLowerCase().includes('chicken') && 
        !meal.name.toLowerCase().includes('beef') && 
        !meal.name.toLowerCase().includes('salmon') && 
        !meal.name.toLowerCase().includes('fish') &&
        !meal.name.toLowerCase().includes('ham')
      );
    }

    allMeals.forEach((meal, index) => {
      const mealCard = createMealCard(meal);
      mealCard.style.animationDelay = `${index * 0.1}s`;
      mealGrid.appendChild(mealCard);
    });
  }, 800);
}

function createMealCard(meal) {
  const card = document.createElement('div');
  card.className = 'meal-card';
  card.dataset.meal = JSON.stringify(meal);
  
  // Get food icon based on meal category
  const getFoodIcon = (category) => {
    const icons = {
      'protein': 'fas fa-drumstick-bite',
      'carbs': 'fas fa-bread-slice',
      'vegetables': 'fas fa-carrot',
      'fruits': 'fas fa-apple-alt',
      'default': 'fas fa-utensils'
    };
    return icons[category] || icons.default;
  };
  
  card.innerHTML = `
    <div class="text-center mb-3">
      <i class="${getFoodIcon(meal.category)} food-category-icon text-green-600"></i>
    </div>
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-semibold text-lg">${meal.name}</h3>
      <div class="text-right">
        <div class="nutrition-badge protein">${meal.protein}g protein</div>
        <div class="nutrition-badge calories">${meal.calories} cal</div>
      </div>
    </div>
    <p class="text-gray-600 text-sm mb-3">${meal.ingredients}</p>
    <div class="flex flex-wrap gap-1">
      <span class="nutrition-badge carbs">${meal.carbs}g carbs</span>
      <span class="nutrition-badge fat">${meal.fat}g fat</span>
    </div>
  `;

  card.addEventListener('click', () => toggleMealSelection(card, meal));
  
  return card;
}

function toggleMealSelection(card, meal) {
  const isSelected = card.classList.contains('selected');
  
  if (isSelected) {
    card.classList.remove('selected');
    selectedMeals = selectedMeals.filter(m => m.name !== meal.name);
  } else {
    card.classList.add('selected');
    selectedMeals.push(meal);
    
    // Add particle effect
    createFoodParticles(card);
    
    // Add success animation
    card.classList.add('food-success');
    setTimeout(() => card.classList.remove('food-success'), 800);
  }
  
  updateNutritionProgress();
}

function updateNutritionProgress() {
  let totalProtein = 0;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  selectedMeals.forEach(meal => {
    totalProtein += meal.protein;
    totalCalories += meal.calories;
    totalCarbs += meal.carbs;
    totalFat += meal.fat;
  });

  // Update display
  document.getElementById("selectedProtein").textContent = totalProtein;
  document.getElementById("selectedCalories").textContent = totalCalories;

  // Update progress bar
  const proteinPercentage = Math.min(100, (totalProtein / userNutrition.protein) * 100);
  const nutritionBar = document.getElementById("nutritionBar");
  nutritionBar.style.width = proteinPercentage + '%';

  // Change color based on progress
  if (proteinPercentage >= 100) {
    nutritionBar.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #fbbf24 100%)';
  } else if (proteinPercentage >= 80) {
    nutritionBar.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';
  } else {
    nutritionBar.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)';
  }
}

function filterMeals(searchTerm) {
  const mealGrid = document.getElementById('mealGrid');
  const meals = mealGrid.querySelectorAll('.meal-card');
  
  meals.forEach(meal => {
    const mealName = meal.querySelector('h3').textContent.toLowerCase();
    const ingredients = meal.querySelector('.text-gray-600').textContent.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const mealData = JSON.parse(meal.dataset.meal);
    
    // Check both category filter and search term
    const categoryMatch = currentCategory === 'all' || mealData.category === currentCategory;
    const searchMatch = searchTerm === '' || mealName.includes(searchLower) || ingredients.includes(searchLower);
    
    if (categoryMatch && searchMatch) {
      meal.style.display = 'block';
    } else {
      meal.style.display = 'none';
    }
  });
}

function filterIngredients(searchTerm) {
  const ingredientGrid = document.getElementById('ingredientGrid');
  const ingredients = ingredientGrid.querySelectorAll('.ingredient-card');
  
  ingredients.forEach(ingredient => {
    const ingredientName = ingredient.querySelector('h3').textContent.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    if (ingredientName.includes(searchLower)) {
      ingredient.style.display = 'block';
      // Remove hidden class when searching to show all matching results
      ingredient.classList.remove('hidden');
    } else {
      ingredient.style.display = 'none';
    }
  });
  
  // Update toggle button visibility based on search
  const toggleBtn = document.getElementById('toggleIngredientsBtn');
  if (toggleBtn) {
    if (searchTerm.trim() === '') {
      toggleBtn.style.display = 'block';
      updateToggleButton();
    } else {
      toggleBtn.style.display = 'none';
    }
  }
}

function clearSelection() {
  selectedMeals = [];
  document.querySelectorAll('.meal-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  updateNutritionProgress();
  showNotification('Selection cleared', 'info');
}

// Custom Meal Builder Functions
function loadIngredients(category) {
  const ingredientGrid = document.getElementById('ingredientGrid');
  
  // Add loading animation
  addFoodLoadingAnimation(ingredientGrid);
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    ingredientGrid.innerHTML = '';

    let allIngredients = [];
    
    if (category === 'all') {
      Object.values(ingredientDatabase).forEach(cat => {
        allIngredients = allIngredients.concat(cat);
      });
    } else {
      allIngredients = ingredientDatabase[category] || [];
    }

    // Reset expand state when changing categories
    ingredientsExpanded = false;
    updateToggleButton();

    allIngredients.forEach((ingredient, index) => {
      const ingredientCard = createIngredientCard(ingredient);
      ingredientCard.style.animationDelay = `${index * 0.05}s`;
      
      // Hide ingredients beyond the initial count
      if (index >= initialIngredientsShown) {
        ingredientCard.classList.add('hidden');
      }
      
      ingredientGrid.appendChild(ingredientCard);
    });
  }, 600);
}

function createIngredientCard(ingredient) {
  const card = document.createElement('div');
  card.className = 'ingredient-card';
  card.dataset.ingredient = JSON.stringify(ingredient);
  
  // Get food icon based on ingredient category
  const getIngredientIcon = (category) => {
    const icons = {
      'proteins': 'fas fa-drumstick-bite',
      'vegetables': 'fas fa-carrot',
      'fruits': 'fas fa-apple-alt',
      'grains': 'fas fa-bread-slice',
      'dairy': 'fas fa-cheese',
      'nuts': 'fas fa-seedling',
      'dressings': 'fas fa-tint',
      'default': 'fas fa-utensils'
    };
    return icons[category] || icons.default;
  };
  
  card.innerHTML = `
    <div class="text-center mb-2">
      <i class="${getIngredientIcon(ingredient.category)} food-category-icon text-purple-600"></i>
    </div>
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-semibold text-sm">${ingredient.name}</h3>
      <div class="text-right text-xs">
        <div class="nutrition-badge protein">${ingredient.protein}g</div>
      </div>
    </div>
    <p class="text-gray-500 text-xs mb-2">${ingredient.serving}</p>
    <div class="flex flex-wrap gap-1">
      <span class="nutrition-badge calories">${ingredient.calories} cal</span>
      <span class="nutrition-badge carbs">${ingredient.carbs}g</span>
      <span class="nutrition-badge fat">${ingredient.fat}g</span>
    </div>
  `;

  card.addEventListener('click', () => toggleIngredientSelection(card, ingredient));
  
  return card;
}

function toggleIngredientSelection(card, ingredient) {
  const isSelected = card.classList.contains('selected');
  
  if (isSelected) {
    card.classList.remove('selected');
    selectedIngredients = selectedIngredients.filter(i => i.name !== ingredient.name);
  } else {
    card.classList.add('selected');
    selectedIngredients.push(ingredient);
    
    // Add particle effect
    createFoodParticles(card);
    
    // Add success animation
    card.classList.add('food-success');
    setTimeout(() => card.classList.remove('food-success'), 800);
  }
  
  updateCustomNutritionProgress();
  updateSelectedIngredientsDisplay();
}

function updateCustomNutritionProgress() {
  let totalProtein = 0;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  selectedIngredients.forEach(ingredient => {
    totalProtein += ingredient.protein;
    totalCalories += ingredient.calories;
    totalCarbs += ingredient.carbs;
    totalFat += ingredient.fat;
  });

  // Update display
  document.getElementById("customProtein").textContent = totalProtein.toFixed(1);
  document.getElementById("customCalories").textContent = totalCalories.toFixed(0);
  document.getElementById("customCarbs").textContent = totalCarbs.toFixed(1);
  document.getElementById("customFat").textContent = totalFat.toFixed(1);

  // Update progress bar
  const proteinPercentage = Math.min(100, (totalProtein / userNutrition.protein) * 100);
  const nutritionBar = document.getElementById("customNutritionBar");
  nutritionBar.style.width = proteinPercentage + '%';

  // Change color based on progress
  if (proteinPercentage >= 100) {
    nutritionBar.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #fbbf24 100%)';
    // Show protein limit notification
    showProteinLimitNotification();
  } else if (proteinPercentage >= 80) {
    nutritionBar.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)';
  } else {
    nutritionBar.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)';
  }
}

function updateSelectedIngredientsDisplay() {
  const container = document.getElementById('selectedIngredients');
  
  if (selectedIngredients.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-sm">No ingredients selected yet. Start building your custom meal!</p>';
    return;
  }

  container.innerHTML = '';
  
  selectedIngredients.forEach(ingredient => {
    const item = document.createElement('div');
    item.className = 'selected-ingredient-item';
    item.innerHTML = `
      <div>
        <div class="font-medium text-sm">${ingredient.name}</div>
        <div class="text-xs text-gray-600">${ingredient.serving} • ${ingredient.protein}g protein</div>
      </div>
      <button class="remove-btn" onclick="removeIngredient('${ingredient.name}')">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(item);
  });
}

function removeIngredient(ingredientName) {
  selectedIngredients = selectedIngredients.filter(i => i.name !== ingredientName);
  
  // Update card selection
  document.querySelectorAll('.ingredient-card').forEach(card => {
    const ingredient = JSON.parse(card.dataset.ingredient);
    if (ingredient.name === ingredientName) {
      card.classList.remove('selected');
    }
  });
  
  updateCustomNutritionProgress();
  updateSelectedIngredientsDisplay();
}

function clearCustomSelection() {
  selectedIngredients = [];
  document.querySelectorAll('.ingredient-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  updateCustomNutritionProgress();
  updateSelectedIngredientsDisplay();
  showNotification('Custom selection cleared', 'info');
}

function toggleIngredientsView() {
  const ingredientCards = document.querySelectorAll('.ingredient-card');
  const toggleBtn = document.getElementById('toggleIngredientsBtn');
  const toggleIcon = document.getElementById('toggleIcon');
  const toggleText = document.getElementById('toggleText');
  
  ingredientsExpanded = !ingredientsExpanded;
  
  ingredientCards.forEach((card, index) => {
    if (index >= initialIngredientsShown) {
      if (ingredientsExpanded) {
        // Show hidden ingredients with staggered animation
        setTimeout(() => {
          card.classList.remove('hidden');
        }, (index - initialIngredientsShown) * 50);
      } else {
        // Hide ingredients beyond initial count
        card.classList.add('hidden');
      }
    }
  });
  
  updateToggleButton();
  
  // Add button animation
  toggleBtn.classList.add('food-success');
  setTimeout(() => toggleBtn.classList.remove('food-success'), 800);
}

function updateToggleButton() {
  const toggleIcon = document.getElementById('toggleIcon');
  const toggleText = document.getElementById('toggleText');
  const toggleBtn = document.getElementById('toggleIngredientsBtn');
  
  if (ingredientsExpanded) {
    toggleIcon.className = 'fas fa-chevron-up mr-2';
    toggleText.textContent = 'Show Less Ingredients';
    toggleBtn.classList.add('bg-red-600', 'hover:bg-red-700');
    toggleBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
  } else {
    toggleIcon.className = 'fas fa-chevron-down mr-2';
    toggleText.textContent = 'Show More Ingredients';
    toggleBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
    toggleBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
  }
}

function saveCustomMeal() {
  if (selectedIngredients.length === 0) {
    showNotification('Please select at least one ingredient', 'error');
    return;
  }

  showInputModal(
    'Save Custom Meal',
    'Give your custom meal a memorable name:',
    'e.g., My Protein Bowl, Healthy Salad, etc.',
    function(mealName) {
      const customMeal = {
        name: mealName,
        ingredients: selectedIngredients,
        protein: selectedIngredients.reduce((sum, i) => sum + i.protein, 0),
        calories: selectedIngredients.reduce((sum, i) => sum + i.calories, 0),
        carbs: selectedIngredients.reduce((sum, i) => sum + i.carbs, 0),
        fat: selectedIngredients.reduce((sum, i) => sum + i.fat, 0),
        isCustom: true
      };

      customMeals.push(customMeal);
      localStorage.setItem('customMeals', JSON.stringify(customMeals));
      
      showNotification(`Custom meal "${mealName}" saved!`, 'success');
    },
    'meal'
  );
}

function addCustomMealToBox() {
  if (selectedIngredients.length === 0) {
    showNotification('Please select at least one ingredient', 'error');
    return;
  }

  showInputModal(
    'Add Custom Meal to Box',
    'Give your custom meal a name before adding it to your box:',
    'e.g., My Protein Bowl, Healthy Salad, etc.',
    function(mealName) {
      // Add success animation to selected ingredient cards
      document.querySelectorAll('.ingredient-card.selected').forEach(card => {
        card.classList.add('food-success');
        setTimeout(() => card.classList.remove('food-success'), 800);
      });

      const customMeal = {
        name: mealName,
        ingredients: selectedIngredients,
        protein: selectedIngredients.reduce((sum, i) => sum + i.protein, 0),
        calories: selectedIngredients.reduce((sum, i) => sum + i.calories, 0),
        carbs: selectedIngredients.reduce((sum, i) => sum + i.carbs, 0),
        fat: selectedIngredients.reduce((sum, i) => sum + i.fat, 0),
        isCustom: true
      };

      // Add to cart
      const existingItem = cart.find(item => item.name === customMeal.name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...customMeal, quantity: 1 });
      }

      updateCartCount();
      
      // Clear selection with animation
      setTimeout(() => {
        clearCustomSelection();
      }, 500);
      
      showNotification(`Custom meal "${mealName}" added to your box! 🍽️`, 'success');
    },
    'meal'
  );
}

function addToBox() {
  if (selectedMeals.length === 0) {
    showNotification('Please select at least one meal', 'error');
    return;
  }

  // Add success animation to selected cards
  document.querySelectorAll('.meal-card.selected').forEach(card => {
    card.classList.add('food-success');
    setTimeout(() => card.classList.remove('food-success'), 800);
  });

  // Add selected meals to cart
  selectedMeals.forEach(meal => {
    const existingItem = cart.find(item => item.name === meal.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...meal, quantity: 1 });
    }
  });

  // Update cart count
  updateCartCount();
  
  // Clear selection with animation
  setTimeout(() => {
    clearSelection();
  }, 500);
  
  showNotification(`${selectedMeals.length} meal(s) added to your box! 🍽️`, 'success');
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartCount');
  // Cap visual count to avoid layout overflow
  cartCountElement.textContent = totalItems > 99 ? '99+' : totalItems;
  
  // Add bounce animation to cart button when items are added
  if (totalItems > 0) {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.classList.add('food-success');
    setTimeout(() => cartBtn.classList.remove('food-success'), 600);
  }
}

function openCart() {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'info');
    return;
  }

  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  // Group items into boxes (each unique meal/ingredient combination is a box)
  const boxes = [];
  const boxMap = new Map();

  cart.forEach(item => {
    const boxKey = item.name + (item.isCustom ? '_custom' : '');
    if (boxMap.has(boxKey)) {
      boxMap.get(boxKey).quantity += item.quantity;
    } else {
      const box = { ...item, quantity: item.quantity };
      boxMap.set(boxKey, box);
      boxes.push(box);
    }
  });

  let totalProtein = 0;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalBoxes = 0;

  // Display each box
  boxes.forEach((box, index) => {
    const boxProtein = box.protein * box.quantity;
    const boxCalories = box.calories * box.quantity;
    const boxCarbs = box.carbs * box.quantity;
    const boxFat = box.fat * box.quantity;
    
    totalProtein += boxProtein;
    totalCalories += boxCalories;
    totalCarbs += boxCarbs;
        totalFat += boxFat;
    totalBoxes += box.quantity;

    let ingredientsText = '';
    if (box.isCustom && box.ingredients) {
      ingredientsText = box.ingredients.map(i => i.name).join(', ');
    } else {
      ingredientsText = box.ingredients || 'Pre-made meal';
    }

    // Check if this box exceeds protein limit
    const proteinExceeded = boxProtein > userNutrition.protein;
    const warningClass = proteinExceeded ? 'border-red-500 bg-red-50' : 'border-gray-200';
    const warningIcon = proteinExceeded ? '<i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>' : '';
    const warningText = proteinExceeded ? '<div class="text-red-600 text-sm font-medium mt-2">⚠️ You reached your protein level for this box!</div>' : '';
    
    const cartItem = document.createElement('div');
    cartItem.className = `cart-item border-2 ${warningClass} rounded-lg p-4 mb-4`;
    
    cartItem.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            ${warningIcon}
            <h4 class="font-semibold text-lg">Box ${index + 1}: ${box.name} ${box.isCustom ? '<span class="text-purple-600 text-xs">(Custom)</span>' : ''}</h4>
          </div>
          <p class="text-sm text-gray-600 mb-2">${ingredientsText}</p>
          <div class="flex gap-2 mb-2">
            <span class="nutrition-badge protein ${proteinExceeded ? 'bg-red-100 text-red-800' : ''}">${box.protein}g protein per item</span>
            <span class="nutrition-badge calories">${box.calories} cal per item</span>
          </div>
          <div class="text-sm text-gray-700">
            <strong>Box Total:</strong> ${boxProtein}g protein, ${boxCalories} calories
          </div>
          ${warningText}
        </div>
        <div class="text-right ml-4">
          <div class="font-semibold text-lg mb-2">Qty: ${box.quantity}</div>
          <button onclick="removeFromCart('${box.name}')" class="text-red-500 hover:text-red-700 text-sm">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  // Add summary section
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4';
  summaryDiv.innerHTML = `
    <div class="flex items-center mb-2">
      <i class="fas fa-boxes text-blue-600 mr-2"></i>
      <h4 class="font-semibold text-blue-800">Order Summary</h4>
    </div>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium">Total Boxes:</span> <span class="text-blue-600 font-bold">${totalBoxes}</span>
      </div>
      <div>
        <span class="font-medium">Unique Items:</span> <span class="text-blue-600 font-bold">${boxes.length}</span>
      </div>
    </div>
  `;
  cartItems.insertBefore(summaryDiv, cartItems.firstChild);

  // Check if overall protein exceeds limit
  if (totalProtein > userNutrition.protein) {
    const overallWarning = document.createElement('div');
    overallWarning.className = 'bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4';
    overallWarning.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-800 font-medium">⚠️ Your total order exceeds your daily protein limit!</span>
      </div>
      <div class="text-sm text-red-600 mt-1">
        Daily limit: ${userNutrition.protein}g | Order total: ${totalProtein}g
      </div>
    `;
    cartItems.insertBefore(overallWarning, cartItems.firstChild);
  }

  // Update totals
  document.getElementById('cartProtein').textContent = totalProtein;
  document.getElementById('cartCalories').textContent = totalCalories;
  document.getElementById('cartCarbs').textContent = totalCarbs;
  document.getElementById('cartFat').textContent = totalFat;

  // Update cart title with box count
  const cartTitleCount = document.getElementById('cartTitleCount');
  if (cartTitleCount) {
    cartTitleCount.textContent = `(${totalBoxes} boxes)`;
  }

  document.getElementById('cartModal').classList.remove('hidden');
  // Prevent background from scrolling while cart modal is open
  lockBodyScroll();
}

function closeCart() {
  document.getElementById('cartModal').classList.add('hidden');
  // Re-enable body scrolling when modal closed
  unlockBodyScroll();
}

// Prevent background scrolling when modals are open
function lockBodyScroll() {
  // Hide page scroll while modal is open
  document.body.classList.add('nb-modal-open');
  // Prevent background scrolling
  try {
    document.body.style.overflow = 'hidden';
  } catch (e) {}
  // prevent page shift by preserving scrollbar space
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollBarWidth > 0) document.body.style.paddingRight = scrollBarWidth + 'px';
}

function unlockBodyScroll() {
  document.body.classList.remove('nb-modal-open');
  try {
    document.body.style.overflow = 'auto';
  } catch (e) {}
  document.body.style.paddingRight = '';
}

function removeFromCart(mealName) {
  cart = cart.filter(item => item.name !== mealName);
  updateCartCount();
  openCart(); // Refresh cart display
  showNotification('Item removed from cart', 'info');
}

function scheduleDelivery() {
  closeCart();
  document.getElementById('deliveryModal').classList.remove('hidden');
  lockBodyScroll();
}

function closeDeliveryModal() {
  document.getElementById('deliveryModal').classList.add('hidden');
  unlockBodyScroll();
}

function confirmDelivery() {
  const date = document.getElementById('deliveryDate').value;
  const time = document.getElementById('deliveryTime').value;

  if (!date) {
    showNotification('Please select a delivery date', 'error');
    return;
  }

  closeDeliveryModal();
  showOrderConfirmation('delivery', { date, time });
}

async function confirmOrder() {
  // Attempt to send order to backend, but still proceed locally if it fails
  try {
    await sendOrderToBackend();
  } catch (err) {
    // If backend save fails, notify and continue with local confirmation
    showNotification('Order not saved to server, placed locally', 'warning');
  }

  closeCart();
  showOrderConfirmation('order');
}

// -------------------- Backend integration helpers --------------------
// Sends the current order (cart) to the backend API using fetch
async function sendOrderToBackend(deliveryInfo = null) {
  // Build a simple order payload from the `cart` array and user info
  const items = cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    isCustom: item.isCustom || false,
    protein: item.protein,
    calories: item.calories,
    carbs: item.carbs,
    fat: item.fat
  }));

  const totalBoxes = cart.reduce((sum, it) => sum + it.quantity, 0);
  const totalProtein = cart.reduce((sum, it) => sum + (it.protein * it.quantity), 0);
  const totalCalories = cart.reduce((sum, it) => sum + (it.calories * it.quantity), 0);

  const payload = {
    customerName: 'Guest', // in a real app collect customer info
    items,
    totalBoxes,
    totalProtein,
    totalCalories,
    delivery: deliveryInfo
  };

  try {
    // POST to the backend. Backend runs on port 5000 by default.
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to save order');
    }

    const saved = await res.json();
    // Tell the user the order was saved on the server
    showNotification('Order saved to server (ID: ' + (saved._id || 'n/a') + ')', 'success');
    return saved;
  } catch (err) {
    console.error('sendOrderToBackend error', err);
    showNotification('Could not save order to server: ' + err.message, 'error');
    throw err; // re-throw so caller can react
  }
}

// Example function to fetch saved orders from backend
// Useful during development / for admin view
async function fetchOrdersFromBackend() {
  try {
    const res = await fetch('http://localhost:5000/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders = await res.json();
    console.log('Orders from backend:', orders);
    // For demo purposes show the count
    showNotification('Fetched ' + orders.length + ' orders from server', 'info');
    return orders;
  } catch (err) {
    console.error(err);
    showNotification('Error fetching orders: ' + err.message, 'error');
    return [];
  }
}


function showOrderConfirmation(type, deliveryInfo = null) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  const content = document.createElement('div');
  content.className = 'bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center';
  
  // Calculate box count before clearing cart
  let totalBoxes = 0;
  if (type === 'order' || type === 'delivery') {
    totalBoxes = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  if (type === 'delivery') {
    content.innerHTML = `
      <div class="success-checkmark">
        <svg class="success-checkmark__circle" cx="60" cy="60" r="50"></svg>
        <svg class="success-checkmark__check" x="25" y="55" width="70" height="70"></svg>
      </div>
      <h3 class="text-xl font-semibold mb-4">Delivery Scheduled!</h3>
      <p class="text-gray-600 mb-4">Your NUTREEBOX (${totalBoxes} boxes) will be delivered on ${deliveryInfo.date} during ${deliveryInfo.time}.</p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p class="text-sm text-blue-800">
          <i class="fas fa-boxes mr-2"></i>
          Delivery Summary: ${totalBoxes} boxes scheduled
        </p>
      </div>
      <button onclick="this.closest('.fixed').remove()" class="nb-btn px-6 py-2 mt-4">Great!</button>
    `;
  } else {
    content.innerHTML = `
      <div class="success-checkmark">
        <svg class="success-checkmark__circle" cx="60" cy="60" r="50"></svg>
        <svg class="success-checkmark__check" x="25" y="55" width="70" height="70"></svg>
      </div>
      <h3 class="text-xl font-semibold mb-4">Order Confirmed!</h3>
      <p class="text-gray-600 mb-4">Your personalized NUTREEBOX order of <strong>${totalBoxes} boxes</strong> has been placed successfully.</p>
      <div class="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
        <p class="text-sm text-green-800">
          <i class="fas fa-boxes mr-2"></i>
          Order Summary: ${totalBoxes} boxes ordered
        </p>
      </div>
      <button onclick="this.closest('.fixed').remove()" class="nb-btn px-6 py-2 mt-4">Continue Shopping</button>
    `;
  }
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Clear cart after order
  if (type === 'order') {
    cart = [];
    updateCartCount();
  }
}

function showProteinLimitNotification() {
  showStickyNotification('🎯 You reached your protein level for today!', 'warning');
}

function showStickyNotification(message, type = 'warning') {
  // Remove any existing sticky notifications first
  const existingSticky = document.querySelector('.protein-limit-notification');
  if (existingSticky) {
    existingSticky.remove();
  }

  const notification = document.createElement('div');
  
  // Set notification styles based on type
  let bgColor, textColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      icon = 'fas fa-check-circle';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      icon = 'fas fa-exclamation-circle';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      textColor = 'text-white';
      icon = 'fas fa-exclamation-triangle';
      break;
    default:
      bgColor = 'bg-blue-500';
      textColor = 'text-white';
      icon = 'fas fa-info-circle';
  }
  
  notification.className = `protein-limit-notification ${bgColor} ${textColor} shadow-lg`;
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="${icon} mr-3 text-xl"></i>
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add a subtle pulse animation to draw attention
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.5s ease-out, pulseWarning 2s infinite';
  }, 100);
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  
  // Set notification styles based on type
  let bgColor, textColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      icon = 'fas fa-check-circle';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      icon = 'fas fa-exclamation-circle';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      textColor = 'text-white';
      icon = 'fas fa-exclamation-triangle';
      break;
    default:
      bgColor = 'bg-blue-500';
      textColor = 'text-white';
      icon = 'fas fa-info-circle';
  }
  
  notification.className = `${bgColor} ${textColor} p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="${icon} mr-3"></i>
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'c':
        e.preventDefault();
        openCart();
        break;
      case 'b':
        e.preventDefault();
        if (!document.getElementById('mealBuilder').classList.contains('hidden')) {
          addToBox();
        }
        break;
    }
  }
});

// Save user data to localStorage
function saveUserData() {
  const userData = {
    nutrition: userNutrition,
    preferences: {
      region: document.querySelector('input[name="region"]:checked')?.value,
      diet: document.querySelector('input[name="diet"]:checked')?.value,
      goal: document.querySelector('input[name="goal"]:checked')?.value
    },
    cart: cart,
    customMeals: customMeals
  };
  localStorage.setItem('nutriBoxData', JSON.stringify(userData));
}

// Load user data from localStorage
function loadUserData() {
  const savedData = localStorage.getItem('nutriBoxData');
  if (savedData) {
    const data = JSON.parse(savedData);
    userNutrition = data.nutrition || userNutrition;
    cart = data.cart || cart;
    customMeals = data.customMeals || customMeals;
    updateCartCount();
    
    // Restore preferences if available
    if (data.preferences) {
      // Restore UI state based on saved preferences
      // This would need to be implemented based on the specific UI state
    }
  }
  
  // Load saved custom meals
  const savedCustomMeals = localStorage.getItem('customMeals');
  if (savedCustomMeals) {
    customMeals = JSON.parse(savedCustomMeals);
  }
}

// Auto-save every 30 seconds
setInterval(saveUserData, 30000);

// Load data on page load
loadUserData(); 

// Additional real-world features
function addDietaryRestriction() {
  showInputModal(
    'Add Dietary Restriction',
    'Enter any dietary restrictions or allergies you have:',
    'e.g., gluten-free, dairy-free, nut-free, etc.',
    function(restriction) {
      dietaryRestrictions.push(restriction.trim().toLowerCase());
      showNotification(`Added restriction: ${restriction}`, 'info');
      filterMealsByRestrictions();
    },
    'restriction'
  );
}

function filterMealsByRestrictions() {
  const mealCards = document.querySelectorAll('.meal-card');
  const ingredientCards = document.querySelectorAll('.ingredient-card');
  
  if (dietaryRestrictions.length === 0) {
    // Show all meals and ingredients
    mealCards.forEach(card => card.style.display = 'block');
    ingredientCards.forEach(card => card.style.display = 'block');
    return;
  }
  
  // Filter meals
  mealCards.forEach(card => {
    const meal = JSON.parse(card.dataset.meal);
    const ingredients = meal.ingredients.toLowerCase();
    const hasRestriction = dietaryRestrictions.some(restriction => 
      ingredients.includes(restriction)
    );
    
    if (hasRestriction) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
    }
  });
  
  // Filter ingredients
  ingredientCards.forEach(card => {
    const ingredient = JSON.parse(card.dataset.ingredient);
    const ingredientName = ingredient.name.toLowerCase();
    const hasRestriction = dietaryRestrictions.some(restriction => 
      ingredientName.includes(restriction)
    );
    
    if (hasRestriction) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
    }
  });
}

function createMealPlan() {
  if (selectedMeals.length === 0) {
    showNotification('Please select some meals first', 'error');
    return;
  }
  
  showInputModal(
    'Create Meal Plan',
    'Give your meal plan a descriptive name:',
    'e.g., Weekly Protein Plan, Weight Loss Meals, etc.',
    function(planName) {
      const mealPlan = {
        name: planName,
        meals: [...selectedMeals],
        totalProtein: selectedMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCalories: selectedMeals.reduce((sum, meal) => sum + meal.calories, 0),
        created: new Date().toISOString()
      };
      
      // Save to localStorage
      const savedPlans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
      savedPlans.push(mealPlan);
      localStorage.setItem('mealPlans', JSON.stringify(savedPlans));
      
      showNotification(`Meal plan "${planName}" created!`, 'success');
    },
    'plan'
  );
}

function trackNutrition() {
  const today = new Date().toDateString();
  const todayNutrition = {
    date: today,
    protein: selectedMeals.reduce((sum, meal) => sum + meal.protein, 0),
    calories: selectedMeals.reduce((sum, meal) => sum + meal.calories, 0),
    carbs: selectedMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: selectedMeals.reduce((sum, meal) => sum + meal.fat, 0)
  };
  
  // Save to nutrition history
  const history = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
  const existingIndex = history.findIndex(entry => entry.date === today);
  
  if (existingIndex >= 0) {
    history[existingIndex] = todayNutrition;
  } else {
    history.push(todayNutrition);
  }
  
  localStorage.setItem('nutritionHistory', JSON.stringify(history));
  showNotification('Nutrition tracked for today!', 'success');
}

// Custom Modal Functions
let currentInputCallback = null;

function showAlertModal(title, message, type = 'info') {
  const modal = document.getElementById('alertModal');
  const icon = document.getElementById('alertIcon');
  const titleEl = document.getElementById('alertTitle');
  const messageEl = document.getElementById('alertMessage');
  
  // Set icon based on type
  let iconClass = 'fas fa-info-circle';
  switch (type) {
    case 'success':
      iconClass = 'fas fa-check-circle';
      break;
    case 'error':
      iconClass = 'fas fa-times-circle';
      break;
    case 'warning':
      iconClass = 'fas fa-exclamation-triangle';
      break;
    default:
      iconClass = 'fas fa-info-circle';
  }
  
  icon.className = iconClass;
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  modal.classList.remove('hidden');
  lockBodyScroll();
  
  // Focus the OK button for accessibility
  setTimeout(() => {
    const okButton = modal.querySelector('.nb-btn');
    if (okButton) okButton.focus();
  }, 100);
}

function closeAlertModal() {
  const modal = document.getElementById('alertModal');
  modal.classList.add('hidden');
  unlockBodyScroll();
}

function showInputModal(title, message, placeholder, callback, type = 'info') {
  const modal = document.getElementById('inputModal');
  const icon = document.getElementById('inputIcon');
  const titleEl = document.getElementById('inputTitle');
  const messageEl = document.getElementById('inputMessage');
  const inputField = document.getElementById('inputField');
  
  // Set icon based on type
  let iconClass = 'fas fa-edit';
  switch (type) {
    case 'meal':
      iconClass = 'fas fa-utensils';
      break;
    case 'restriction':
      iconClass = 'fas fa-exclamation-triangle';
      break;
    case 'plan':
      iconClass = 'fas fa-calendar-plus';
      break;
    default:
      iconClass = 'fas fa-edit';
  }
  
  icon.className = iconClass;
  titleEl.textContent = title;
  messageEl.textContent = message;
  inputField.placeholder = placeholder;
  inputField.value = '';
  
  currentInputCallback = callback;
  
  modal.classList.remove('hidden');
  lockBodyScroll();
  
  // Focus the input field
  setTimeout(() => {
    inputField.focus();
  }, 100);
}

function closeInputModal() {
  const modal = document.getElementById('inputModal');
  modal.classList.add('hidden');
  currentInputCallback = null;
  unlockBodyScroll();
}

function confirmInputModal() {
  const inputField = document.getElementById('inputField');
  const value = inputField.value.trim();
  
  if (value && currentInputCallback) {
    currentInputCallback(value);
  }
  
  closeInputModal();
}

// Handle Enter key in input modal
document.addEventListener('DOMContentLoaded', function() {
  const inputField = document.getElementById('inputField');
  if (inputField) {
    inputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        confirmInputModal();
      }
    });
  }
  
  // Close modals when clicking outside
  const alertModal = document.getElementById('alertModal');
  const inputModal = document.getElementById('inputModal');
  
  if (alertModal) {
    alertModal.addEventListener('click', function(e) {
      if (e.target === alertModal) {
        closeAlertModal();
      }
    });
  }
  
  if (inputModal) {
    inputModal.addEventListener('click', function(e) {
      if (e.target === inputModal) {
        closeInputModal();
      }
    });
  }
});

function showNutritionAnalytics() {
  const history = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
  
  if (history.length === 0) {
    showNotification('No nutrition data available', 'info');
    return;
  }
  
  // Calculate averages
  const avgProtein = history.reduce((sum, day) => sum + day.protein, 0) / history.length;
  const avgCalories = history.reduce((sum, day) => sum + day.calories, 0) / history.length;
  
  const message = `Nutrition Analytics (${history.length} days):
    Average Protein: ${avgProtein.toFixed(1)}g
    Average Calories: ${avgCalories.toFixed(0)}
    Target Protein: ${userNutrition.protein}g
    Target Calories: ${userNutrition.calories}`;
  
  showAlertModal('Nutrition Analytics', message, 'info');
} 