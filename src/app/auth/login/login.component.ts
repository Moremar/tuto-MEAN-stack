// Angular imports
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// Internal imports
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  errorMessage: string = null;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    // display the spinner during the login HTTP call
    this.errorMessage = null;
    this.loading = true;

    const email = loginForm.value.email;
    const password = loginForm.value.password;
    console.log('Trying to login with ' + email + '/' + password);

    this.authService.login(email, password).subscribe(
      (_: boolean) => {
        this.loading = false;
        this.router.navigate(['list']);
      },
      (e: Error) => {
        this.errorMessage = e.message;
        this.loading = false;
      }
    );
  }
}
