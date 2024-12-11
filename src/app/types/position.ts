import { Category } from './category';

export interface Position {
  _id: string;
  title: string;
  amount: number;
  date: Date;
  category: Category;
  type: string;
  userId: string;
}
