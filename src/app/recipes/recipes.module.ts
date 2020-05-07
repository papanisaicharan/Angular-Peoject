import { NgModule } from '@angular/core';
import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';

// creating the Recipes module
@NgModule({
    // these are the components present in this module
    // Remember, declaration has to be made only once(in the module that is created), use them by exporting and importing
    declarations : [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent
    ],
    // these are the module imported for some functionality
    imports: [
        RouterModule,
        ReactiveFormsModule,
        RecipesRoutingModule,
        SharedModule
    ],
    // exporting these, so that if any module imported this module, they will be able to use this components
    // removing the exports, because. when we import this module this internally imports RecipesRoutingModule, 
    // which internally request for the import of the components.
    // exports: [
    //     RecipesComponent,
    //     RecipeListComponent,
    //     RecipeDetailComponent,
    //     RecipeItemComponent,
    //     RecipeStartComponent,
    //     RecipeEditComponent
    // ],
}) 
export class RecipeModule{}