import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipeModule' }// lazy-loading recipes to save the data
  // { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipeModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
