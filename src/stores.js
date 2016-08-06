import React from 'react';
import { observable, computed, autorun, action } from 'mobx';
import 'whatwg-fetch';
import marked from 'marked';

class Recipe {
  name;
  what;
  how;

  constructor(name, what, how) {
    this.name = name;
    this.what = what;
    this.how = marked(how.join("\n\n"));
  }
  slug() {
    return this.name.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

class RecipeStore {
  @observable recipes = [];
  @observable currentRecipeSlug = null;

  @action loadRecipes() {
    if( ! this.hasRecipes() ) {
      fetch('/recipes.js')
        .then((response) => response.json())
        .then((json) => {
          for(let r of json) {
            this.addRecipe(r);
          }
        })
    }
  }

  hasRecipes() {
    return this.recipes.length != 0
  }

  @computed get currentRecipe() {
    return this.recipes.find(recipe => recipe.slug() === this.currentRecipeSlug)
  }

  addRecipe(json) {
    this.recipes.push(new Recipe(json.name, json.what, json.how))
  }
}

export const recipeStore = new RecipeStore();
autorun(() => {
  document.title = `foodprocessor - ${recipeStore.currentRecipe ? recipeStore.currentRecipe.name : "recipes" }`;
  window.scrollTo(0,0);
});
