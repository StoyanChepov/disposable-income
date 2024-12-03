import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPositions().subscribe((positions) => {
      console.log(positions);

      this.positions = positions;
      //this.isLoading = false;
    });
  }
}
