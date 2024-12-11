import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Position } from '../../types/position';
import { ApiService } from '../../api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../modals/confirm-delete/confirm-delete.component';
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
    private dialog: MatDialog,
    private router: Router
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
    if (!positionId || positionId === '' || typeof positionId !== 'string') {
      console.log('No valid position ID provided.');
      return;
    }
    // Mock data, replace with a service call
    this.apiService.getPositionById(positionId).subscribe((position) => {
      console.log('Position:', position);
      this.position = position;
    });
  }

  private dialogRef: MatDialogRef<ConfirmDeleteComponent> | null = null;
  expenseDeleteHandler(): void {
    if (this.dialogRef) {
      console.log('A dialog is already open.');
      return; // Exit the method to prevent opening another dialog
    }
    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { position: this.position },
      disableClose: true,
      });

    const mainContent = document.querySelector('app-root'); // Adjust selector to your main content
    if (mainContent) {
      mainContent.setAttribute('inert', 'true'); // Disable interaction
    }

    this.dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog opened and focus managed.');
    });

    // Handle the result of the dialog
    this.dialogRef.afterClosed().subscribe((result) => {
      if (mainContent) mainContent.removeAttribute('inert'); // Re-enable interaction

      if (result) {
        console.log('Position deleted!');
        this.apiService.removePosition(this.position!._id).subscribe(() => {
          console.log('Position deleted!');
          // Redirect to the home page after the position is deleted
          this.router.navigate(['/home']);
        });
      } else {
        console.log('Delete cancelled.');
      }

      // Reset the dialog reference after it is closed
      this.dialogRef = null;
    });
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
