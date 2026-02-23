import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // shell route will be added later
];
