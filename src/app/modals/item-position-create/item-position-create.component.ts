import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-item-position-create',
  template: `
    <h2 mat-dialog-title>Add a line</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Item</mat-label>
          <mat-select formControlName="item">
            <mat-option *ngFor="let item of items" [value]="item._id">{{
              item.name
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input
            matInput
            formControlName="price"
            placeholder="Enter price"
            type="number"
          />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Quantity</mat-label>
          <input
            matInput
            formControlName="quantity"
            placeholder="Enter quantity"
            type="number"
          />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Unit</mat-label>
          <mat-select formControlName="unit">
            <mat-option *ngFor="let unit of units" [value]="unit._id">{{
              unit.name
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Amount</mat-label>
          <input
            matInput
            formControlName="amount"
            placeholder="Amount"
            type="number"
            [readonly]="true"
          />
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button
          mat-button
          color="primary"
          [disabled]="form.invalid"
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NoopAnimationsModule,
    MatSelectModule,
  ],
  providers: [provideAnimations()],
})
export class ItemPositionCreateComponent {
  form: FormGroup;
  items: any[] = [];
  units: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ItemPositionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: string },
    private fb: FormBuilder,
    private apiService: ApiService // assuming you have a service to fetch items
  ) {
    this.form = this.fb.group({
      item: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      amount: [{ value: '', disabled: true }],
    });

    this.loadItems();
    this.loadUnits();
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
      values.amount = values.price * values.quantity;
      this.dialogRef.close(values);
    }
  }
}
