const RECIPES_KEY = 'recipes_app';

// Modelo de dados com 5 campos (4 + id)
const defaultRecipe = {
  id: '',
  title: '',
  ingredients: '',
  instructions: '',
  preparationTime: 0,
  difficulty: 'Fácil'
};

const getRecipes = () => {
  const recipes = localStorage.getItem(RECIPES_KEY);
  return recipes ? JSON.parse(recipes) : [];
};

const saveRecipes = (recipes) => {
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
};

export const getAllRecipes = () => {
  return getRecipes();
};

export const getRecipeById = (id) => {
  const recipes = getRecipes();
  return recipes.find(recipe => recipe.id === id);
};

export const createRecipe = (recipeData) => {
  const recipes = getRecipes();
  const newRecipe = {
    ...defaultRecipe,
    ...recipeData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  recipes.push(newRecipe);
  saveRecipes(recipes);
  return newRecipe;
};

export const updateRecipe = (id, recipeData) => {
  const recipes = getRecipes();
  const index = recipes.findIndex(recipe => recipe.id === id);
  if (index !== -1) {
    recipes[index] = { 
      ...recipes[index], 
      ...recipeData, 
      updatedAt: new Date().toISOString() 
    };
    saveRecipes(recipes);
    return recipes[index];
  }
  return null;
};

export const deleteRecipe = (id) => {
  const recipes = getRecipes();
  const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
  saveRecipes(filteredRecipes);
  return true;
};