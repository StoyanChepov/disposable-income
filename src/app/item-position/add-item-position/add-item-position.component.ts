import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { Item } from '../../types/item';
import { Unit } from '../../types/unit';
import { CommonModule } from '@angular/common';
import { ItemDialogHandler } from './create-item-handler';
@Component({
  selector: 'app-add-item-position',
  templateUrl: './add-item-position.component.html',
  styleUrl: './add-item-position.component.css',
  standalone: true,
  //encapsulation: ViewEncapsulation.ShadowDom,
  imports: [  FormsModule,
    ReactiveFormsModule,
    CommonModule,],
})

export class ItemPositionCreateComponent {
  items: any[] = [];
  units: any[] = [];

  form = new FormGroup({
    item: new FormControl(['', Validators.required]),
    price: new FormControl([0, [Validators.required, Validators.min(0)]]),
    quantity: new FormControl([0, [Validators.required, Validators.min(0)]]),
    amount: new FormControl([{ disabled: true }]),
    unit: new FormControl(['', Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<ItemPositionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: string },
    private fb: FormBuilder,
    private apiService: ApiService, // assuming you have a service to fetch items
    private itemDialogHandler: ItemDialogHandler
  ) {}

  openItemModal(): void {
    this.itemDialogHandler.createItemHandler((newItem) => {
      if (newItem) {
        console.log('New Item created:', newItem);
        this.items.unshift(newItem); // Add the new category to the list
        this.form.controls['item'].setValue(newItem._id); // Set it as selected
      }
    });
  }

  loadItems() {
    this.apiService.getAllItems().subscribe((items) => {
      this.items = items;
    });
  }

  loadUnits() {
    this.apiService.getAllUnits().subscribe((units) => {
      this.units = units;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const values = this.form.value;

      this.dialogRef.close(values);
    }
  }
}
