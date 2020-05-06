import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  // this gives the access to the first element in dom with this type occurrance.
  // if it is angular 9, then please remove  {static: false}
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription; 

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

  // switch function to fluctuate between login and singup
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // when form submitted.
  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log(form.valid)
      return;
    }
    console.log(form.valid)
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    // Login or signup process began, so flag enabled
    this.isLoading = true;

    // based on flag respective functionality is called through service
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    // when destroying the auth component, unsubscribing the closeSub.
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string){
    // new dynamic components can be created using the factory method in angular
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // getting the ViewContainerRef of the place where are trying to render
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    // removes the previously rendered components
    hostViewContainerRef.clear();
    // now creating a dynamic component in that loaction.
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    // this is used to access the inputs and outputs for databinding and event binding
    componentRef.instance.message = message;
    // it is possible to subscribe for the eventemitters, so subscibe for it
    this.closeSub =  componentRef.instance.close.subscribe(() => {
      // clear the subscriptions
      this.closeSub.unsubscribe();
      // and remove the rendering 
      hostViewContainerRef.clear();
    });
    
  }
}
