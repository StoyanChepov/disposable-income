import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { EmailDirective } from '../../directives/email.directive';
import { SUFFIXES } from '../../constants';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, EmailDirective, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  suffixes = SUFFIXES;
  errorMessage: string = '';
  constructor(private userService: UserService, private router: Router) {}

  /*isFieldTextMissing(controlName: string) {
    return (
      this.form.get(controlName).hasError('required') &&
      this.form.get(controlName).touched
    );
  }*/

  register(form: NgForm) {
    if (form.invalid) {
      console.log('Invalid form');
      return;
    }
    console.log('Form is valid');
    const { email, password, rePassword } = form.value;
    this.userService
      .register(email!, password!, rePassword!)
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
          console.log('User registered', response);
          this.router.navigate(['/']);
        }
      });
  }
}
