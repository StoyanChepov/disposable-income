import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCreateComponent } from '../../modals/confirm-create/confirm-create.component'; // Update the path based on your project structure
import { ApiService } from '../../api.service'; // Update the path based on your project structure

@Injectable({
  providedIn: 'root', // Or provide it in the specific module if needed
})
export class ItemDialogHandler {
  private dialogRef: MatDialogRef<ConfirmCreateComponent> | null = null;

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  createItemHandler(handleItemCreated: (item: any) => void): void {
    if (this.dialogRef) {
      console.log('A dialog is already open.');
      return; // Prevent opening another dialog
    }

    this.dialogRef = this.dialog.open(ConfirmCreateComponent, {
      data: { object: 'item' },
      width: '300px',
      disableClose: true,
    });

    const mainContent = document.querySelector('app-root');
    if (mainContent) {
      mainContent.setAttribute('inert', 'true'); // Disable interaction
    }

    this.dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog opened and focus managed.');
    });

    this.dialogRef.afterClosed().subscribe((name) => {
      if (mainContent) mainContent.removeAttribute('inert'); // Re-enable interaction
      console.log('Result:', name);

      if (name) {
        console.log('Item added!');
        this.apiService.createItem(name).subscribe((item) => {
          console.log('Item created:', item);
          handleItemCreated(item);
        });
      } else {
        console.log('Item creation cancelled.');
      }

      this.dialogRef = null; // Reset dialog reference
    });
  }
}
