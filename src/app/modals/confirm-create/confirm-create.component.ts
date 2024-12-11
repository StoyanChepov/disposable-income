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

@Component({
  selector: 'app-confirm-create',
  template: `
    <h1 mat-dialog-title>Create {{ data.object }}</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter name" />
          <mat-error
            *ngIf="form.get('name')?.invalid && form.get('name')?.touched"
          >
            Name is required.
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-button color="primary" [disabled]="form.invalid">
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
  ],
  providers: [provideAnimations()],
})
export class ConfirmCreateComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: string },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.name);
    }
  }
}
