import { Component, OnInit, signal, computed } from '@angular/core';
import { UserService } from '../user/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Position } from '../types/position';
import { ApiService } from '../api.service';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Note the corrected property name to `styleUrls`
})
export class HomeComponent implements OnInit {
  // Signals for reactive state management
  positions = signal<Position[]>([]);
  hoveredId = signal<string | undefined>(undefined);
  isLoggedIn = computed(() => this.userService.isLogged);

  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.apiService.getLatestPositions(3).subscribe((positions) => {
        console.log('All positions:', positions);
        this.positions.set(positions); // Update the signal
      });
    }
  }

  handleMouseEnter(id: string | undefined): void {
    this.hoveredId.set(id); // Update the signal
  }

  handleClick(): void {
    const id = this.hoveredId(); // Access the signal value
    if (id) {
      this.router.navigate([`/positions/${id}/details`]);
    }
  }
}
