import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
import { ItemDialogHandler } from '../create-item-handler';
@Component({
  selector: 'app-add-item-position',
  templateUrl: './add-item-position.component.html',
  styleUrl: './add-item-position.component.css',
  standalone: true,
  //encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ItemPositionCreateComponent implements OnInit {
  items: Item[] = [];
  units: string[] = [];

  form = new FormGroup({
    item: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    unit: new FormControl(''),
    amount: new FormControl(0),
  });

  ngOnInit() {
    this.loadItems();
    this.loadUnits();
    this.setupAmountCalculation();
  }

  constructor(
    public dialogRef: MatDialogRef<ItemPositionCreateComponent>,
    private apiService: ApiService, // assuming you have a service to fetch items
    private itemDialogHandler: ItemDialogHandler
  ) {}

  private setupAmountCalculation(): void {
    // Subscribe to changes in 'price' and 'quantity'
    this.form.valueChanges.subscribe((values) => {
      const price = values.price || 0;
      const quantity = values.quantity || 0;
      const amount = price * quantity;

      // Update the 'amount' field
      this.form.controls['amount'].setValue(amount, { emitEvent: false });
    });
  }

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
      console.log('Items:', items);

      this.items = items;
      if (this.items.length > 0) {
        this.form.get('item')?.setValue(this.items[0]?._id);
      }
    });
  }

  loadUnits() {
    //this.apiService.getAllUnits().subscribe((units) => {
    let defaultUnits: string[] = ['pcs', 'kg', 'm', 'h'];
    this.units = defaultUnits;
    if (this.units.length > 0) {
      this.form.get('unit')?.setValue(this.units[0]);
    }
    //});
  }

  onCancel(): void {
    this.form.reset();
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const values = this.form.value;
      const selectedItem = this.items.find((item) => item._id === values.item);
      const selectedUnit = this.units.find((unit) => unit === values.unit);

      const result = {
        ...values,
        item: selectedItem,
        unit: selectedUnit,
        status: 'new',
        _id: Math.random().toString(36),
      };
      console.log('Form submitted:', result);
      this.dialogRef.close(result);
    } else {
      console.log('Invalid form');
      console.log(this.form.errors);
      this.form.markAllAsTouched();
    }
  }
}
