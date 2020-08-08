// Angular imports
import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // auto login if we have a valid auth token in local storage
    this.authService.autoLogin();
  }
}
