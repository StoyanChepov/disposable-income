import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Position } from '../../types/position';
import { CategoryDialogHandler } from '../../categories/category-handler';

@Component({
  selector: 'app-edit-position',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-position.component.html',
  styleUrl: './edit-position.component.css',
})
export class EditPositionComponent implements OnInit {
  editForm!: FormGroup;
  positionId!: string;
  categories: any[] = [];
  position: Position | null = null;
  //itemPositions: ItemPosition[] = [];
  totalAmount: number = 0;

  showItemPosModal: boolean = false;
  showItemPosModalEdit: boolean = false;
  showCategoryModal: boolean = false;

  itemPosId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService, //private categoryService: CategoryService
    private categoryDialogHandler: CategoryDialogHandler
  ) {}

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id')!;

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      category: [null, Validators.required],
      amount: [{ value: 0 }],
    });

    this.loadExpense();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.apiService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  private loadExpense(): void {
    this.apiService.getPositionById(this.positionId).subscribe((position) => {
      this.position = position;
      //this.itemPositions = expense.itemPositions || [];
      //this.updateTotalAmount();
      this.editForm.patchValue({
        title: position.title,
        date: position.date?.toString().split('T')[0],
        category: position.category._id,
        amount: position.amount, //this.totalAmount,
      });
    });
  }
  openCategoryModal(): void {
    this.categoryDialogHandler.createCategoryHandler((newCategory) => {
      if (newCategory) {
        console.log('New category created:', newCategory);
        this.categories.unshift(newCategory); // Add the new category to the list
        this.editForm.controls['category'].setValue(newCategory._id); // Set it as selected
      }
    });
  }
  onSubmit(): void {
    const formData = this.editForm.value;
    if (this.editForm.invalid) {
      console.log('Invalid form');

      return;
    }

    const updatedPos = {
      ...this.position,
      ...formData,
      category: formData.category,
      //itemPositions: this.itemPositions,
    };

    this.apiService
      .updatePosition(this.positionId, updatedPos)
      .subscribe(() => {
        sessionStorage.removeItem('itemPositionsEdit');
        this.router.navigate([`/positions/${this.positionId}/details`]);
      });
  }
}
