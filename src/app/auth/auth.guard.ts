// Angular imports
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
// Internal imports
import { Post } from '../posts/model/post.model';
import { User } from './model/user.model';
import { AuthService } from './auth.service';
import { PostService } from '../posts/post.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private postService: PostService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // redirect to login if not authenticated      
    console.log('Auth interceptor checks auth for requested route');
    if (!this.authService.getToken()) {
      console.error('Authentication was not verified, access denied');
      this.router.navigate(['login']);
      return false;   // optional, since we already navigate away
    }

    // if requesting to edit a specific post, check if it belongs to the authenticated user
    console.log('Authentication verified, access granted');
    if (next.params && next.params.id) {
      // get authenticated user (runs immediately because it is a behavior subject)
      let loggedInUser: User = null;
      this.authService.loggedInUserListener.pipe(take(1)).subscribe(
        (user: User) => {
          loggedInUser = user;
        }
      );
      // accept the route only if the post belongs to that authenticated user
      return this.postService.getPostObservable(next.params.id).pipe(
        map(
          (post: Post) => {
            if (post.userId != loggedInUser.id) {
              console.error('Can only edit posts belonging to authenticated user, access denied');
              this.router.navigate(['list']);
              return false;   // optional, since we already navigate away
            }
            return true;
          }
        )
      );
    }
    return true;
  }
}
