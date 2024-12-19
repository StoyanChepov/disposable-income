import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemPositionCreateComponent } from './add-item-position/add-item-position.component'; // Update the path based on your project structure
import { ItemPositionEditComponent } from './edit-item-position/edit-item-position.component'; // Update the path based on your project structure

@Injectable({
  providedIn: 'root', // Or provide it in the specific module if needed
})
export class ItemPosDialogHandler {
  private dialogRefCreatePos: MatDialogRef<ItemPositionCreateComponent> | null =
    null;
  private dialogRefEditPos: MatDialogRef<ItemPositionEditComponent> | null =
    null;

  constructor(private dialog: MatDialog) {}

  createItemPosHandler(handleItemPosCreated: (itemPos: any) => void): void {
    if (this.dialogRefCreatePos) {
      console.log('A dialog is already open.');
      return; // Prevent opening another dialog
    }

    this.dialogRefCreatePos = this.dialog.open(ItemPositionCreateComponent, {
      data: { object: 'category' },
      disableClose: true,
    });

    const mainContent = document.querySelector('app-root');
    if (mainContent) {
      mainContent.setAttribute('inert', 'true'); // Disable interaction
    }

    this.dialogRefCreatePos.afterOpened().subscribe(() => {
      console.log('Dialog opened and focus managed.');
    });

    this.dialogRefCreatePos.afterClosed().subscribe((res) => {
      if (mainContent) mainContent.removeAttribute('inert'); // Re-enable interaction
      console.log('Result:', res);
      if (res) {
        console.log('ItemPos added!');
        handleItemPosCreated(res);
      } else {
        console.log('ItemPos creation cancelled.');
      }

      this.dialogRefCreatePos = null; // Reset dialog reference
    });
  }

  editItemPosHandler(
    handleItemPosEdited: (itemPos: any) => void,
    hoveredId: string
  ): void {
    if (this.dialogRefEditPos) {
      console.log('A dialog is already open.');
      return; // Prevent opening another dialog
    }
    console.log('hoveredId:', hoveredId);

    this.dialogRefEditPos = this.dialog.open(ItemPositionEditComponent, {
      data: { id: hoveredId },
      disableClose: true,
    });

    const mainContent = document.querySelector('app-root');
    if (mainContent) {
      mainContent.setAttribute('inert', 'true'); // Disable interaction
    }

    this.dialogRefEditPos.afterOpened().subscribe(() => {
      console.log('Dialog opened and focus managed.');
    });

    this.dialogRefEditPos.afterClosed().subscribe((res) => {
      if (mainContent) mainContent.removeAttribute('inert'); // Re-enable interaction
      console.log('Result:', res);
      if (res) {
        console.log('ItemPos edited!');
        handleItemPosEdited(res);
      } else {
        console.log('ItemPos editing cancelled.');
      }

      this.dialogRefEditPos = null; // Reset dialog reference
    });
  }
}
