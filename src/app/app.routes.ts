import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AddItemComponent } from './item/add-item/add-item.component';
import { ItemsComponent } from './item/items/items.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '404', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'edit-item/:id', component: AddItemComponent },
  { path: 'items', component: ItemsComponent },
  { path: '**', redirectTo: '/404' },
];
