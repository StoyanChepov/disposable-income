import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AddPositionComponent } from './position/add-position/add-position.component';
import { PositionListComponent } from './position/position-list/position-list.component';
import { EditPositionComponent } from './position/edit-position/edit-position.component';
import { AuthGuard } from './guards/auth.guard';
import { PositionDetailsComponent } from './position/position-details/position-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '404', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'positions/create',
    component: AddPositionComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'edit-position/:id',
    component: EditPositionComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'positions',
    component: PositionListComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'positions/:positionId/details',
    component: PositionDetailsComponent,
    //canActivate: [AuthGuard],
  },
  { path: 'logout', redirectTo: '/login' },
  { path: '**', redirectTo: '/404' },
];
