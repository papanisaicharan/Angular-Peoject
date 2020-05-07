import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

import { RecipeModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  // Remember, declaration has to be made only once(in the module that is created), use them by exporting and importing
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RecipeModule,
    ShoppingListModule,
    AuthModule,
    SharedModule,
    CoreModule
  ],
  // removing the services here to make a service module as CoreModule
  // providers: [
  // ],
  // which component is used in index.html
  bootstrap: [AppComponent]
})
export class AppModule {}
