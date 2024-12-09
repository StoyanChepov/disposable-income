// position-create.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { PositionService } from 'src/app/services/position.service';
//import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.css',
})
export class AddPositionComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  itemPositions: any[] = [];
  showCategoryModal = false;
  showItemPosModal = false;
  type: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router //private positionService: PositionService, //private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
      amount: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    // Load categories
    /* this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });*/

    // Load item positions from sessionStorage
    const cachedData = sessionStorage.getItem('itemPositions');
    if (cachedData) {
      this.itemPositions = JSON.parse(cachedData);
    }

    // Calculate total amount
    this.updateAmount();
  }

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

  onSubmit(): void {
    if (this.form.invalid) return;

    const values = { ...this.form.value, itemPositions: this.itemPositions };
    /* this.positionService.createPosition(values).subscribe(
      (positionId) => {
        sessionStorage.removeItem('itemPositions');
        this.router.navigate([`/positions/${positionId}/details`]);
      },
      (error) => console.error(error)
    );*/
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
}
