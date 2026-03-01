import { Routes } from '@angular/router';
import { StarterPage } from './starter-page/starter-page';
import { CreateSessionPage } from './create-session-page/create-session-page';
import { IconPicker } from './icon-picker/icon-picker';

export const routes: Routes = [
    { path: '', component: StarterPage },
    { path: 'create-session', component: CreateSessionPage },
];
