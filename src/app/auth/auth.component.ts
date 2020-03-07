import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseDate } from './auth.service';
import { Observable } from 'rxjs';
import { error } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {  
  isLoggedMode = false;
  isLoading = false;
  error: string = null;
  isloggedIn = false;

  constructor(private authService: AuthService, private router: Router){}

  onSwitchMode(){
    this.isLoggedMode = !this.isLoggedMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let resObs: Observable<AuthResponseDate>;

    this.isLoading = true
    if(this.isLoggedMode){
      resObs = this.authService.signIn(email,password);
    }else{
      resObs = this.authService.singUp(email,password);
    }
    resObs.subscribe(responseData => {
      this.error = "LoggedIn successfully!"
      console.log(responseData);
      this.isLoading = false;
      this.isloggedIn = true;
      this.router.navigate(['/recipes']);
    },
    errorMessage => {
      console.log("error : "+ errorMessage);
      this.error = errorMessage
      this.isLoading = false;
      this.isloggedIn = false;
    })
    console.log(form.value);
    form.reset();
  }
}
