import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  positions: Position[] = [];
  hoveredId: string | undefined = undefined;
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
    if (this.isLoggedIn) {
      this.apiService.getLatestPositions(3).subscribe((positions) => {
        console.log('All positions:', positions);

        this.positions = positions;
        //this.isLoading = false;
      });
    }
  }

  handleMouseEnter(id: string | undefined): void {
    this.hoveredId = id;
  }

  handleClick(): void {
    if (this.hoveredId !== null && this.hoveredId !== undefined) {
      this.router.navigate([`/positions/${this.hoveredId}/details`]);
    }
  }
}
