// position-create.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { Position } from '../../types/position';
import { CategoryDialogHandler } from '../../categories/create-category-handler';
import { ItemPosDialogHandler } from '../../item-position/add-item-position/create-item-pos-handler';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
  ],
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
    private router: Router, //private positionService: PositionService, //private categoryService: CategoryService
    private route: ActivatedRoute,
    private apiService: ApiService,
    private categoryDialogHandler: CategoryDialogHandler,
    private createItemPosHandler: ItemPosDialogHandler
  ) {}

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    category: new FormControl(null, []),
    amount: new FormControl('', [Validators.required]),
  });

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
    };
    console.log('Creating position:', values);

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
    this.categoryDialogHandler.createCategoryHandler((newCategory) => {
      if (newCategory) {
        console.log('New category created:', newCategory);
        this.categories.unshift(newCategory); // Add the new category to the list
        this.form.controls['category'].setValue(newCategory._id); // Set it as selected
      }
    });
  }

  openItemPositionModal(): void {
    this.createItemPosHandler.createItemPosHandler((newItemPos) => {
      if (newItemPos) {
        console.log('New item position created:', newItemPos);
        this.itemPositions.push(newItemPos);
        sessionStorage.setItem(
          'itemPositions',
          JSON.stringify(this.itemPositions)
        );
        this.updateAmount();
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type');
      this.apiService.getCategories().subscribe((categories) => {
        console.log('Categories:', categories);

        this.categories = categories;
        if (this.categories.length > 0) {
          this.form.get('category')?.setValue(this.categories[0]._id);
        }
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
}
