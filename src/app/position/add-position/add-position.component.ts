// position-create.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { ItemPosition } from '../../types/itemPosition';
import { CategoryDialogHandler } from '../../categories/create-category-handler';
import { ItemPosDialogHandler } from '../../item-position/item-pos-handler';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Category } from '../../types/category';
import { ItemPositionEditComponent } from '../../item-position/edit-item-position/edit-item-position.component';

@Component({
  selector: 'app-add-position',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    ItemPositionEditComponent,
  ],
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.css',
})
export class AddPositionComponent implements OnInit {
  categories: Category[] = [];
  itemPositions: ItemPosition[] = [];
  showCategoryModal = false;
  showItemPosModal = false;
  type: string | null = null;
  showModal = false;
  hoveredId: string | undefined = undefined;

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
    category: new FormControl('', []),
    amount: new FormControl(0, [Validators.required]),
  });

  updateAmount(): void {
    if (!this.itemPositions || !Array.isArray(this.itemPositions)) {
      console.error('itemPositions is not an array or is undefined');
      return;
    }

    const amount = this.itemPositions.reduce(
      (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
      0
    );

    this.form.controls['amount'].setValue(amount);
  }

  create() {
    if (this.form.invalid) {
      console.log('Invalid form');
      this.form.markAllAsTouched(); // Highlight all invalid fields
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
        this.itemPositions.forEach((item) => {
          const itemPos = {
            ...item,
            positionId: typedPosition._id,
            item: item.item._id,
            unit: item.unit,
          };
          this.apiService.createItemPosition(itemPos).subscribe((itemPos) => {
            console.log('Item position created:', itemPos);
          });
        });

        // Clear the itemPositions cache
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
        this.itemPositions = [...this.itemPositions, newItemPos];
        console.log('New item positions array:', newItemPos);

        sessionStorage.setItem(
          'itemPositions',
          JSON.stringify(this.itemPositions)
        );
        this.updateAmount();
      }
    });
  }

  openEditItemPositionModal(): void {
    this.createItemPosHandler.editItemPosHandler((editedItemPos) => {
      if (editedItemPos) {
        //replace the item PositionDetailsComponent with the edited itemPos
        console.log('Edited item position is:', editedItemPos);

        this.itemPositions = this.itemPositions.map((item) =>
          item._id === editedItemPos._id ? editedItemPos : item
        );
        sessionStorage.setItem(
          'itemPositions',
          JSON.stringify(this.itemPositions)
        );
        this.hoveredId = undefined;
        this.updateAmount();
      }
    }, this.hoveredId!);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type');
      this.apiService.getCategories().subscribe((categories) => {
        console.log('Categories:', categories);

        this.categories = categories;
        if (this.categories.length > 0) {
          this.form.get('category')?.setValue(this.categories[0]?._id);
        }
      });

      // Load item positions from sessionStorage
      const cachedData = sessionStorage.getItem('itemPositions');
      console.log('Cached data:', cachedData);

      if (cachedData) {
        this.itemPositions = JSON.parse(cachedData);
      }

      // Calculate total amount
      this.updateAmount();
    });
  }

  ngOnDestroy() {
    sessionStorage.removeItem('itemPositions');
  }

  handleMouseEnter(id: string | undefined): void {
    this.hoveredId = id;
  }

  handleClick(): void {
    if (this.hoveredId !== null && this.hoveredId !== undefined) {
      this.openEditItemPositionModal();
    }
  }
}
