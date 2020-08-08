import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // force the load from local storage if any
    console.log('Auth interceptor checks auth for requested route');
    if (!this.authService.getToken()) {
      console.error('Authentication was not verified, access denied');
      this.router.navigate(['login']);
      return false;   // optional, since we already navigate away
    }
    console.log('Authentication was verified, access granted');
    return true;
  }
}
