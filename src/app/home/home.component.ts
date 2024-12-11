import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Position } from '../types/position';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  positions: Position[] = [];
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}
  get isLoggedIn(): boolean {
    return this.userService.isLogged;
  }
  ngOnInit(): void {
    this.apiService.getLatestPositions(3).subscribe((positions) => {
      console.log('All positions:', positions);

      this.positions = positions;
      //this.isLoading = false;
    });
  }
}
