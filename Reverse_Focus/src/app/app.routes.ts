import { Routes } from '@angular/router';
import { StarterPage } from './starter-page/starter-page';
import { CreateSessionPage } from './create-session-page/create-session-page';
import { WebsiteBlocker } from './website-blocker/website-blocker';

export const routes: Routes = [
    { path: '', component: StarterPage, pathMatch: 'full' },
    { path: 'create-session', component: CreateSessionPage },
    { path: 'blocker', component: WebsiteBlocker },
    { path: '**', redirectTo: '' }
];
