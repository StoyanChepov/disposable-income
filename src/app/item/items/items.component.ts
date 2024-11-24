import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {}
