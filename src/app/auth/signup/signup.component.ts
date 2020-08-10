// Angular imports
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// Internal imports
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  loading = false;
  errorMessage: string = null;

  constructor(private router: Router,
              private authService: AuthService) {}


  ngOnInit() {}


  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }

    // display the spinner during the login HTTP call
    this.errorMessage = null;
    this.loading = true;

    const username = signupForm.value.username;
    const email = signupForm.value.email;
    const password = signupForm.value.password;
    console.log('DEBUG - Trying to signup with ' + username + '/' + email + '/' + password);

    this.authService.signup(username, email, password).subscribe(
      (_: boolean) => {
        this.loading = false;
        // automatically login the new created user on successful signup
        this.authService.login(email, password).subscribe(
          (__: boolean) => {
            this.router.navigate(['list']);
          },
          (e: Error) => {
            // login should not be possible to fail since the credentials are those just created
            this.errorMessage = e.message;
            this.loading = false;
          }
        );
      },
      (e: Error) => {
        this.errorMessage = e.message;
        this.loading = false;
      }
    );
  }
}
