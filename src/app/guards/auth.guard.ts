import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../user/user.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  if (userService.isLogged) {
    console.log('User is logged in', userService.isLogged);

    return true;
  }
  router.navigate(['/home']);
  return false;
};
