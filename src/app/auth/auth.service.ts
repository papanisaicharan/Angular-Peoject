import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

// It is the response model class that we get from firebase.
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
  // BehaviorSubject is a type of subject, a subject is a special type of observable so you can subscribe to messages like any other observable. 
  // this observable gives the access to the observers to the previously emitted value
  // even though it created after the emitting, it still have the access to the previous emitted value.
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    // use the above link to know more about the request and response payloads
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDTPtm2Wo6pNHWaVaesI7aZVM5s_tXIFGU',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
      // You can use pipes to link operators together. Pipes let you combine multiple functions into a single function.
      // refer regx to know more about pipes: https://angular.io/guide/rx-library
      // https://stackoverflow.com/questions/48030197/what-is-pipe-function-in-angular

      // for more info on catchError : https://rxjs-dev.firebaseapp.com/api/operators/catchError
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDTPtm2Wo6pNHWaVaesI7aZVM5s_tXIFGU',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // this is useful when you reload the page 
  autoLogin() {
    // get the useData from storage
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    // convert into object
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // calling logout function after session expiry: return observable
  autoLogout(expirationDuration: number) {
    console.log("expires in : "+expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    // As expiresIn is in milliseconds, converting it and finding the expirationDate
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    // creating the user using user-model
    const user = new User(email, userId, token, expirationDate);
    // passing the values to the subscribers.
    this.user.next(user);
    // creating a session which expires in expiresIn * 1000 time
    this.autoLogout(expiresIn * 1000);
    // store it in browser local Storage
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    // based on the reponse from firebase access the error msg and validate accordingly, refer the link about
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    // return the error observable
    return throwError(errorMessage);
  }
}
