import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './shared/layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/matches/match-list.page').then((m) => m.MatchListPage),
      },
      {
        path: 'matches/:id',
        loadComponent: () =>
          import('./features/matches/match-detail.page').then((m) => m.MatchDetailPage),
      },
      {
        path: 'create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/matches/match-create.page').then((m) => m.MatchCreatePage),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
];
