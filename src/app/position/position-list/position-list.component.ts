import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Position } from '../../types/position';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-position-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './position-list.component.html',
  styleUrl: './position-list.component.css',
})
export class PositionListComponent implements OnInit {
  positions: Position[] = [];
  isLoading = true;
  type: string | null = null;
  hoveredId: string | undefined = undefined;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        // Filter out cases where 'type' is null or undefined.
        filter((params) => params.has('type')),
        // Map the 'type' parameter.
        switchMap((params) => {
          this.type = params.get('type');
          console.log('Query param type:', this.type);

          // Fetch positions and apply filtering based on 'type'.
          return this.apiService.getPositions().pipe(
            filter((positions) => positions.length > 0) // Optional: Filter non-empty responses.
          );
        })
      )
      .subscribe({
        next: (positions) => {
          this.positions = positions.filter((position) =>
            this.type ? position.type === this.type : true
          );
          console.log('Filtered positions:', this.positions);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching positions:', err);
          this.isLoading = false;
        },
      });
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
