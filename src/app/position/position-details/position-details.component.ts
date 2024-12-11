import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Position } from '../../types/position';
import { ApiService } from '../../api.service';
@Component({
  selector: 'app-position-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './position-details.component.html',
  styleUrl: './position-details.component.css',
})
export class PositionDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  position: Position | null = null; // Updated to hold a single Position
  isOwner = true;
  isAuthenticated = true;
  showModal = false;
  attachments: any[] = [{ _id: '1', url: 'https://via.placeholder.com/150' }];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const positionId = params['positionId'];
      if (positionId) {
        this.loadPosition(positionId);
      }
    });
  }

  loadPosition(positionId: string): void {
    console.log('Loading position with ID:', positionId);
    // Mock data, replace with a service call
    this.apiService.getPositionById(positionId).subscribe((position) => {
      console.log('Position:', position);
      this.position = position;
    });
  }

  expenseDeleteHandler() {
    console.log('Delete expense');
  }

  handleCloseModal() {
    this.showModal = false;
  }

  handleConfirmDelete() {
    console.log('Confirm delete');
  }

  setAttachments(newAttachments: any[]) {
    this.attachments = newAttachments;
  }
}
