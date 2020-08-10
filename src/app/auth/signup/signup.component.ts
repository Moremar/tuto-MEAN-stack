import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  loading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }
    const username = signupForm.value.username;
    const email = signupForm.value.email;
    const password = signupForm.value.password;
    console.log('Trying to signup with ' + username + '/' + email + '/' + password);

    this.authService.signup(username, email, password);
  }
}
