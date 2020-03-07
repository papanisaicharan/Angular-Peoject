import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  subscription = new Subscription();
  collapsed = true;
  constructor(private dataStorageService: DataStorageService,private authservice: AuthService) {}

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  ngOnInit() {
    this.subscription = this.authservice.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(this.isAuthenticated);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
