import { Routes } from '@angular/router';
import { AuthGuard } from '../ACCommon/guards/auth.guard';
import { SplashComponent } from './splash/splash.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/splash', pathMatch: 'full' },
    { path: 'splash', component: SplashComponent },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.module')
            .then(m => m.AuthModule)},
    { path: 'status', loadChildren: () => import('./modules/status/status.module')
            .then(m => m.StatusModule), canActivate: [AuthGuard]  },
    { path: 'profile', loadChildren: () => import('./modules/profile/profile.module')
            .then(m => m.ProfileModule), canActivate: [AuthGuard]  },
    { path: 'history', loadChildren: () => import('./modules/history/history.module')
            .then(m => m.HistoryModule), canActivate: [AuthGuard]  },
    { path: 'messaging', loadChildren: () => import('./modules/messaging/messaging.module')
            .then(m => m.MessagingModule)  },
    { path: 'settings', loadChildren: () => import('./modules/settings/settings.module')
            .then(m => m.SettingsModule)  },
    { path: 'scheduler', loadChildren: () => import('./modules/scheduler/scheduler.module')
            .then(m => m.SchedulerModule)  }
  ];
