import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../user.service';
import {
  FormsModule,
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { emailValidator } from '../../utils/email.validator';
import { SUFFIXES } from '../../constants';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage: string = '';
  constructor(private userService: UserService, private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      emailValidator(SUFFIXES),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  isInputEmpty(controlName: string) {
    return (
      this.form.get(controlName)?.touched &&
      this.form.get(controlName)?.errors?.['required']
    );
  }

  login() {
    if (this.form.invalid) {
      console.log('Invalid form');
      return;
    }
    const { email, password } = this.form.value;
    this.userService
      .login(email!, password!)
      .pipe(
        catchError((error) => {
          // Handle the error gracefully using RxJS
          this.errorMessage =
            'The system was unable to log you in. Please try again.';
          console.error('Login failed', error);
          return of(null); // Return null or an empty observable to complete the stream
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('User logged in', response);
          this.router.navigate(['/']);
        }
      });
  }
}
