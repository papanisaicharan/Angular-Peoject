import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseDate{
    kind: string;
    idToken: string;
    email : string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; //optional
}

@Injectable({providedIn: 'root'})
export class AuthService{
    constructor(private httpclient: HttpClient){}
    user = new Subject<User>();

    signIn(email: string,password: string){
        return this.httpclient.post<AuthResponseDate>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDTPtm2Wo6pNHWaVaesI7aZVM5s_tXIFGU',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(respData => {
            this.handleAuthentication(respData.email,respData.localId,respData.idToken,respData.expiresIn);
        }));
    }

    singUp(email: string, password: string){
        return this.httpclient.post<AuthResponseDate>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTPtm2Wo6pNHWaVaesI7aZVM5s_tXIFGU',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(respData => {
            this.handleAuthentication(respData.email,respData.localId,respData.idToken,respData.expiresIn);
        }));
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "An unknown error occurred!";
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage)
        }
                switch(errorRes.error.error.message){
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = "Email Not found!";
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = "Invalid password!";
                        break;
                    case 'EMAIL_EXISTS':
                        errorMessage = "An account already exist with this email!";
                }
                return throwError(errorMessage);
    }

    private handleAuthentication(email:string , localId: string, idToken: string, expiresIn: string){
        const user = new User(email,localId,idToken,new Date((+expiresIn)*1000 + new Date().getTime()));
        this.user.next(user);

    }
}