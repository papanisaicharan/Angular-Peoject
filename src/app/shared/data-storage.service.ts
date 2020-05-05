import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // https://angular.io/api/common/http/HttpClient#usage-notes
    this.http
      .put(
        'https://angular-course-93154.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    // get the latest user and unsubscribe it : take function does that.
    // https://rxjs-dev.firebaseapp.com/api/operators/exhaustMap
    // https://angular.io/api/common/http/HttpClient#usage-notes
    // https://angular.io/guide/rx-library
    // https://rxjs-dev.firebaseapp.com/api/operators/tap
    return this.http
      .get<Recipe[]>(
        // we can also set the param in the url item, but preferring this way.
        'https://angular-course-93154.firebaseio.com/recipes.json'
        // instead use interceptor, and add the params
        // {
        //   params: new HttpParams().set('auth', user.token)
        // }
      ).pipe(   
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}
