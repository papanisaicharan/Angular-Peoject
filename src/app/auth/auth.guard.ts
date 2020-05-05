import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


// It safe guards the component and maintain security for the component
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    constructor(private authservice: AuthService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean | UrlTree>{
        return this.authservice.user.pipe(take(1), map(user => {
            const isAuth = !!user;
            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }
}