const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: string;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string[];
  originalData: any;
}

export const mealAPI = {
  searchMealsByName: async (query: string): Promise<Meal[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (e) {
      console.error('Error searching meals by name:', e);
      return [];
    }
  },

  getMealById: async (id: string): Promise<Meal | null> => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.error('Error fetching meal by ID:', e);
      return null;
    }
  },

  getRandomMeal: async (): Promise<Meal | null> => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.error('Error fetching random meal:', e);
      return null;
    }
  },

  getMultipleRandomMeals: async (count = 6): Promise<Meal[]> => {
    try {
      const promises = Array(count)
        .fill(null)
        .map(() => mealAPI.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null);
    } catch (e) {
      console.error('Error fetching multiple random meals:', e);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (e) {
      console.error('Error fetching categories:', e);
      return [];
    }
  },

  filterByIngredient: async (ingredient: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (e) {
      console.error('Error filtering meals by ingredient:', e);
      return [];
    }
  },

  filterByCategory: async (category: string): Promise<Meal[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (e) {
      console.error('Error filtering meals by category:', e);
      return [];
    }
  },

  transformMealData: (meal: any): Meal | null => {
    if (!meal) return null;

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        const measureText =
          measure && measure.trim() ? `${measure.trim()}` : '';
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    const instructions = meal.strInstructions
      ? meal.strInstructions
          .split(/\r?\n/)
          .filter((step: string) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + '...'
        : '',
      image: meal.strMealThumb,
      cookTime: 'N/A',
      servings: 'N/A',
      category: meal.strCategory || 'N/A',
      area: meal.strArea || 'N/A',
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
