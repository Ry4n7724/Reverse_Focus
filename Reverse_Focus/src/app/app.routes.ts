import { Routes } from '@angular/router';
import { StarterPage } from './starter-page/starter-page';
import { CreateSessionPage } from './create-session-page/create-session-page';
import { WebsiteBlocker } from './website-blocker/website-blocker';
import { dashboardGuard } from './guard/dashboard-guard';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: StarterPage, canActivate: [dashboardGuard], pathMatch: 'full' },
    { path: 'create-session', component: CreateSessionPage },
    { path: 'blocker', component: WebsiteBlocker },
    { path: 'dashboard', component: Dashboard, canActivate: [dashboardGuard] },
    { path: '**', redirectTo: '' }
];
