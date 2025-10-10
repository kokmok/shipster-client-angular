import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { entitiesRoutes } from '@/pages/entities.routes';
import { AuthGard } from '@/auth/auth-gard';



export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGard],
        children: [
            { path: '', component: Dashboard },
            ...entitiesRoutes

        ]
    },
    // { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
