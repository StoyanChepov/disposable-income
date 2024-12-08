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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, EmailDirective, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  suffixes = SUFFIXES;
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
      .subscribe((response) => {
        console.log('User registered', response);
        this.router.navigate(['/']);
      });
  }
}
