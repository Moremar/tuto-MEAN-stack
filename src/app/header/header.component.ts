// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedIn = false;
  private loggedInSub: Subscription = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loggedInSub = this.authService.authenticatedListener.subscribe(
      authenticated => {
        console.log('Logged in = ' + authenticated);
        this.loggedIn = authenticated;
      }
    );
  }

  ngOnDestroy() {
    if (this.loggedInSub) {
      this.loggedInSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
