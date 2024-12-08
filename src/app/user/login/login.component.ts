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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  login() {
    if (this.form.invalid) {
      console.log('Invalid form');

      return;
    }
    const { email, password } = this.form.value;
    this.userService.login(email!, password!).subscribe((response) => {
      console.log('User logged in', response);
      this.router.navigate(['/']);
    });
  }
}
