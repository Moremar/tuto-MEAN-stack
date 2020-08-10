// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// Internal includes
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/model/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedInUser: User = null;
  private loggedInUserSub: Subscription = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loggedInUserSub = this.authService.loggedInUserListener.subscribe(
      user => {
        this.loggedInUser = user;
      }
    );
  }

  ngOnDestroy() {
    if (this.loggedInUserSub) {
      this.loggedInUserSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
