import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-position-details',
  standalone: true,
  imports: [],
  templateUrl: './position-details.component.html',
  styleUrl: './position-details.component.css',
})
export class PositionDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      
    });
  }
}
