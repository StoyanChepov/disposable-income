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
    private apiService: ApiService //private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id')!;
    this.loadExpense();
    //this.loadCategories();

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
      amount: [{ value: 0, disabled: true }],
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
        category: position.category,
        amount: position.amount, //this.totalAmount,
      });
    });
  }
  /*
  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
*/
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
        this.router.navigate([`/expenses/${this.positionId}/details`]);
      });
  }

  /* updateTotalAmount(): void {
    this.totalAmount = this.itemPositions.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    this.editForm.patchValue({ amount: this.totalAmount });
  }
  */
  /*
  handleItemPosCreate(itemPosition: ItemPosition): void {
    itemPosition.status = 'new';
    // this.itemPositions.push(itemPosition);
    /* sessionStorage.setItem(
      'itemPositionsEdit',
      JSON.stringify(this.itemPositions)
    );
    this.updateTotalAmount();
    this.showItemPosModal = false; 
  }
  handleItemPosEdit(itemPosition: ItemPosition): void {
    itemPosition.status = 'updated';
    this.itemPositions = this.itemPositions.map((item) =>
      item._id === itemPosition._id ? itemPosition : item
    );
    sessionStorage.setItem(
      'itemPositionsEdit',
      JSON.stringify(this.itemPositions)
    );
    this.updateTotalAmount();
    this.showItemPosModalEdit = false;
    this.itemPosId = null;
  }
    

  handleCategoryCreate(categoryName: string): void {
    this.categoryService
      .createCategory(categoryName)
      .subscribe((newCategory) => {
        this.categories.push(newCategory);
        this.editForm.patchValue({ category: newCategory._id });
        this.showCategoryModal = false;
      });
  }
      */
}
