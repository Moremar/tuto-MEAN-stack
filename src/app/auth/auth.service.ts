import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { Credentials } from './model/credentials.model';
import { RestPostAuthLoginResponse, RestPostAuthSignupResponse } from './model/rest-auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;
  authenticatedListener = new BehaviorSubject<boolean>(false);

  // timer to auto-logout on authentication token expiration
  private autoLogoutTimer: any = null;

  private AUTH_URL = 'http://localhost:3000/api/auth';


  constructor(private http: HttpClient,
              private router: Router) {}


  getToken(): string {
    return this.token;
  }


  logout() {
    clearTimeout(this.autoLogoutTimer);
    this._deleteTokenFromStorage();
    this.token = null;
    this.authenticatedListener.next(false);
    this.router.navigate(['login']);
  }


  signup(email: string, password: string) {
    const credentials = new Credentials(email, password);
    this.http.post<RestPostAuthSignupResponse>(this.AUTH_URL + '/signup', credentials).subscribe(
      (signupResponse: RestPostAuthSignupResponse) => {
        console.log(signupResponse);
        console.log('You are signed up now !');
        this.router.navigate(['login']);
      },
      (errorResponse: RestPostAuthSignupResponse) => {
        console.log(errorResponse);
        console.log('You are not signed up !');
      }
    );
  }


  login(email: string, password: string) {
    const credentials = new Credentials(email, password);
    this.http.post<RestPostAuthLoginResponse>(this.AUTH_URL + '/login', credentials).subscribe(
      (loginResponse: RestPostAuthLoginResponse) => {
        console.log(loginResponse);

        // store the token in local storage and in memory
        // it is attached to all requests needing authentication by the auth-interceptor
        this._saveTokenInStorage(loginResponse.token, loginResponse.expiresIn);
        this.autoLogin();
        this.router.navigate(['list']);
      },

      (errorResponse: RestPostAuthLoginResponse) => {
        console.error('Failed to login :');
        console.error(errorResponse);
      }
    );
  }


  // try to login from the token in local storage
  autoLogin() {
    console.log('Look for auth token in local storage.');
    const storedTokenInfo = this._readFromStorage();
    if (!storedTokenInfo || storedTokenInfo.expiresIn < 0) {
      // no token or expired token
      console.log('No token found, cannot auto-login.');
      this._deleteTokenFromStorage();
      return;
    }
    // successful authentication
    console.log('Auth token found :');
    console.log(storedTokenInfo);
    this.token = storedTokenInfo.token;
    this.authenticatedListener.next(true);
    this._scheduleAutoLogout(storedTokenInfo.expiresIn);
  }


  private _scheduleAutoLogout(expiresIn: number) {
    console.log('Schedule auto logout in ' + expiresIn + ' ms');
    this.autoLogoutTimer = setTimeout(
      () => {
        console.log('Authentication token expired, need to login again.');
        this.logout();
      },
      expiresIn
    );
  }


  private _saveTokenInStorage(token: string, expiresIn: number) {
    const expiresInMs = expiresIn * 1000;
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresInMs);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }


  private _readFromStorage() {
    const tokenStr = localStorage.getItem('token');
    const expirationDateStr = localStorage.getItem('expirationDate');
    if (!tokenStr || !expirationDateStr) {
      return null;
    }
    const expirationDate: Date = new Date(expirationDateStr);
    const now: Date = new Date();
    return {
      token: tokenStr,
      expiresIn: expirationDate.getTime() - now.getTime()
    };
  }


  private _deleteTokenFromStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
