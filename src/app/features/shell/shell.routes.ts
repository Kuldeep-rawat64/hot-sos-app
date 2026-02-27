import { Routes } from '@angular/router';
import { Shell } from './shell';

export const shellRoutes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: 'housekeeping',
        loadComponent: () => import('../housekeeping/housekeeping').then((m) => m.Housekeeping),
      },
      {
        path: 'service-orders',
        loadComponent: () =>
          import('../service-orders/service-orders').then((m) => m.ServiceOrders),
      },
      {
        path: 'guests',
        loadComponent: () => import('../guests/guests').then((m) => m.Guests),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: '',
        redirectTo: 'housekeeping',
        pathMatch: 'full',
      },
    ],
  },
];
