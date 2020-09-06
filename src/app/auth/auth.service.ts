// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Internal imports
import { User } from './model/user.model';
import { Credentials } from './model/credentials.model';
import { StoredUserData } from './model/storedUserData.model';
import { RestPostAuthLoginResponse, RestPostAuthSignupResponse } from './model/rest-auth.model';
import { environment } from 'src/environments/environment';


const AUTH_URL = environment.backendUrl + '/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;
  loggedInUserListener = new BehaviorSubject<User>(null);

  // timer to auto-logout on authentication token expiration
  private autoLogoutTimer: any = null;


  constructor(private http: HttpClient,
              private router: Router) {}


  getToken(): string {
    return this.token;
  }


  logout() {
    clearTimeout(this.autoLogoutTimer);
    this._deleteTokenFromStorage();
    this.token = null;
    this.loggedInUserListener.next(null);
    this.router.navigate(['login']);
  }


  signup(username: string, email: string, password: string): Observable<boolean> {
    const credentials = new Credentials(username, email, password);
    return this.http.post<RestPostAuthSignupResponse>(AUTH_URL + '/signup', credentials)
    .pipe(
      // transform the result on success to hide the HTTP details
      map(
        (_: RestPostAuthSignupResponse) => {
          console.log('Signup successful');
          return true;
        }
      ),
      // transform the error to only show the error message
      catchError(
        (errorResponse: HttpErrorResponse) => {
          console.log('Signup failed');
          throw new Error(errorResponse.error.message);
        }
      )
    );
  }


  login(email: string, password: string): Observable<boolean> {
    const credentials = new Credentials(null, email, password);
    return this.http.post<RestPostAuthLoginResponse>(AUTH_URL + '/login', credentials)
    .pipe(map(
      (loginResponse: RestPostAuthLoginResponse) => {
        console.log('Login successful');

        // store the token in local storage and in memory
        // it is attached to all requests needing authentication by the auth-interceptor
        const user = new User(loginResponse.user._id, loginResponse.user.username, loginResponse.user.email);
        const userData = new StoredUserData(user, loginResponse.token, loginResponse.expiresIn);
        this._saveTokenInStorage(userData);
        this.autoLogin();
        return true;
      }
    ),
      // transform the error to only show the error message
      catchError(
        (errorResponse: HttpErrorResponse) => {
          console.log('Login failed');
          throw new Error(errorResponse.error.message);
        }
      )
    );
  }


  // try to login from the token in local storage
  autoLogin() {
    console.log('Look for auth token in local storage.');
    const userData = this._readFromStorage();
    if (!userData || userData.expiresIn < 0) {
      // no token or expired token
      console.log('No token found, cannot auto-login.');
      this._deleteTokenFromStorage();
      return;
    }
    // successful authentication
    console.log('Auth token found :');
    console.log(userData);

    this.token = userData.token;
    this.loggedInUserListener.next(new User(userData.user.id, userData.user.username, userData.user.email));
    this._scheduleAutoLogout(userData.expiresIn);
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


  private _saveTokenInStorage(userData: StoredUserData) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + userData.expiresIn);
    localStorage.setItem('id', userData.user.id);
    localStorage.setItem('username', userData.user.username);
    localStorage.setItem('email', userData.user.email);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }


  private _readFromStorage(): StoredUserData {
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const expirationDateStr = localStorage.getItem('expirationDate');
    if (!token || !expirationDateStr) {
      return null;
    }
    const expirationDate: Date = new Date(expirationDateStr);
    const now: Date = new Date();
    return new StoredUserData(new User(userId, username, email), token, expirationDate.getTime() - now.getTime());
  }


  private _deleteTokenFromStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
