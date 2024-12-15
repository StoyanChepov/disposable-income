import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemPositionCreateComponent } from '../modals/item-position-create/item-position-create.component'; // Update the path based on your project structure
import { ApiService } from '../api.service'; // Update the path based on your project structure

@Injectable({
  providedIn: 'root', // Or provide it in the specific module if needed
})
export class ItemPosDialogHandler {
  private dialogRef: MatDialogRef<ItemPositionCreateComponent> | null = null;

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  createItemPosHandler(handleItemPosCreated: (itemPos: any) => void): void {
    if (this.dialogRef) {
      console.log('A dialog is already open.');
      return; // Prevent opening another dialog
    }

    this.dialogRef = this.dialog.open(ItemPositionCreateComponent, {
      data: { object: 'category' },
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
        console.log('ItemPos added!');
        this.apiService.createItemPosition(name).subscribe((itemPos) => {
          console.log('ItemPos created:', itemPos);
          handleItemPosCreated(itemPos);
        });
      } else {
        console.log('ItemPos creation cancelled.');
      }

      this.dialogRef = null; // Reset dialog reference
    });
  }
}
