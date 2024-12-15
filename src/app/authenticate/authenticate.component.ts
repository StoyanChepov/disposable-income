import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css',
})
export class AuthenticateComponent implements OnInit {
  isAuth = true;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userService.isLogged) {
      this.userService.isAuthenticated.subscribe({
        next: () => {
          this.isAuth = false;
        },
        error: () => {
          this.isAuth = false;
        },
        complete: () => {
          this.isAuth = false;
        },
      });
    } else {
      this.isAuth = false;
    }
  }
}
