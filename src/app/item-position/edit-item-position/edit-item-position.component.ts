import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
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
import { ItemDialogHandler } from '../create-item-handler';
import { ActivatedRoute } from '@angular/router';
import { ItemPosition } from '../../types/itemPosition';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-item-position',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './edit-item-position.component.html',
  styleUrl: './edit-item-position.component.css',
})
export class ItemPositionEditComponent implements OnInit {
  items: Item[] = [];
  units: string[] = [];
  itemPosId: string | null = null;
  status: string = '';
  _id: string = '';

  form = new FormGroup({
    item: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    unit: new FormControl(''),
    amount: new FormControl(0),
  });

  constructor(
    public dialogRef: MatDialogRef<ItemPositionEditComponent>,
    private apiService: ApiService,
    private itemDialogHandler: ItemDialogHandler,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit() {
    this.itemPosId = this.data.id; // Get ID from dialog data
    console.log('Hovered ID passed to dialog:', this.itemPosId);
    this.loadUnits();
    this.setupAmountCalculation();
    this.loadItemPositionData();
  }

  private setupAmountCalculation(): void {
    this.form.valueChanges.subscribe((values) => {
      const price = values.price || 0;
      const quantity = values.quantity || 0;
      const amount = price * quantity;

      this.form.controls['amount'].setValue(amount, { emitEvent: false });
    });
  }

  private loadItemPositionData() {
    if (this.itemPosId) {
      let itemPosition = JSON.parse(
        sessionStorage.getItem('itemPositions')!
      )?.find((itemPos: ItemPosition) => itemPos._id === this.itemPosId);

      if (!itemPosition) {
        this.status = 'old';
        this.apiService
          .getItemPositionById(this.itemPosId)
          .subscribe((itemPos) => {
            if (itemPos) {
              this.patchFormWithItemPositionAfterItemsLoad(itemPos);
            }
          });
      } else {
        this.status = 'new';
        this.patchFormWithItemPositionAfterItemsLoad(itemPosition);
      }
    }
  }

  private patchFormWithItemPositionAfterItemsLoad(itemPosition: ItemPosition) {
    this.apiService.getAllItems().subscribe((items) => {
      this.items = items;
      this._id = itemPosition._id;
      this.form.patchValue(
        {
          item: itemPosition.item._id,
          price: itemPosition.price,
          quantity: itemPosition.quantity,
          unit: itemPosition.unit,
          amount: itemPosition.amount,
        },
        { emitEvent: false }
      );
    });
  }
  openItemModal(): void {
    this.itemDialogHandler.createItemHandler((newItem) => {
      if (newItem) {
        this.items.unshift(newItem);
        this.form.controls['item'].setValue(newItem._id);
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
        status: this.status,
        _id: this._id,
      };
      this.dialogRef.close(result);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
