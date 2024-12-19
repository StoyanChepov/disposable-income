import { Item } from './item';
import { Unit } from './unit';

export interface ItemPosition {
  _id: string;
  amount: number;
  quantity: number;
  price: number;
  userId: string;
  item: Item;
  positionId: string;
  createdOn: Date;
  unit: string;
}
