import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Position } from '../../types/position';

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
  hoveredId: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type');
      console.log('Query param type:', this.type);

      this.apiService.getPositions().subscribe((positions) => {
        console.log('All positions:', positions);

        this.positions = positions.filter((position) =>
          this.type ? position.type === this.type : true
        );
        //this.isLoading = false;
      });
    });
  }

  handleMouseEnter(id: string): void {
    this.hoveredId = id;
  }

  handleClick(): void {
    if (this.hoveredId !== null && this.hoveredId !== undefined) {
      this.router.navigate([`/positions/${this.hoveredId}/details`]);
    }
  }
}
