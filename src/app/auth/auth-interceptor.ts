import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

/**
 * HTTP Interceptor used to attach the authentication token to all outgoing requests
 * It needs to be @Injectable() to allow to inject the authentication service
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // set authentication token in header
    const token = this.authService.getToken();
    console.log('Adding token ' + token + ' to the outgoing HTTP request');

    const updatedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });

    return next.handle(updatedReq);
  }

}
