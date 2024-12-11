// position-create.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
//import { PositionService } from 'src/app/services/position.service';
//import { CategoryService } from 'src/app/services/category.service';
import { Position } from '../../types/position';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCreateComponent } from '../../modals/confirm-create/confirm-create.component';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.css',
})
export class AddPositionComponent implements OnInit {
  categories: any[] = [];
  itemPositions: any[] = [];
  showCategoryModal = false;
  showItemPosModal = false;
  type: string | null = null;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router, //private positionService: PositionService, //private categoryService: CategoryService
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    category: new FormControl('', []),
    amount: new FormControl('', [Validators.required]),
  });

  onAddItemPosition(item: any): void {
    this.itemPositions.push(item);
    sessionStorage.setItem('itemPositions', JSON.stringify(this.itemPositions));
    this.updateAmount();
  }

  updateAmount(): void {
    const amount = this.itemPositions.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    this.form.controls['amount'].setValue(amount);
  }

  create() {
    if (this.form.invalid) {
      console.log('Invalid form');
      return;
    }

    const values = {
      ...this.form.value,
      type: this.type,
      category: '66f4076a695d90360b26c23e',
    };
    this.apiService.addPosition(values).subscribe((position) => {
      console.log('Position created:', position);

      const typedPosition = position as Position; // Specify the expected type
      if (typedPosition && typedPosition._id) {
        sessionStorage.removeItem('itemPositions');

        this.router.navigate([`/positions/${typedPosition._id}/details`]);
      } else {
        console.error('Position or position._id is undefined.');
      }
    });
  }

  openCategoryModal(): void {
    this.showCategoryModal = true;
  }

  openItemPositionModal(): void {
    this.showItemPosModal = true;
  }

  handleCategoryCreated(category: any): void {
    this.showCategoryModal = false;
    this.categories.unshift(category);
    this.form.controls['category'].setValue(category._id);
  }

  handleItemPositionCreated(item: any): void {
    this.showItemPosModal = false;
    this.onAddItemPosition(item);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type');
      this.apiService.getCategories().subscribe((categories) => {
        console.log('Categories:', categories);

        this.categories = categories;
      });

      // Load item positions from sessionStorage
      const cachedData = sessionStorage.getItem('itemPositions');
      if (cachedData) {
        this.itemPositions = JSON.parse(cachedData);
      }

      // Calculate total amount
      this.updateAmount();
    });
  }

  private dialogRef: MatDialogRef<ConfirmCreateComponent> | null = null;
  createCategoryHandler(): void {
    if (this.dialogRef) {
      console.log('A dialog is already open.');
      return; // Exit the method to prevent opening another dialog
    }
    this.dialogRef = this.dialog.open(ConfirmCreateComponent, {
      data: { object: 'category' },
      width: '300px',
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
    this.dialogRef.afterClosed().subscribe((name) => {
      if (mainContent) mainContent.removeAttribute('inert'); // Re-enable interaction
      console.log('Result:', name);

      if (name) {
        console.log('Category added!');
        this.apiService.createCategory(name).subscribe(() => {});
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
}
