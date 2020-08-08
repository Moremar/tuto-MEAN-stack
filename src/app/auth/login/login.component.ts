import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    const email = loginForm.value.email;
    const password = loginForm.value.password;
    console.log('Trying to login with ' + email + '/' + password);

    this.authService.login(email, password);
  }
}
