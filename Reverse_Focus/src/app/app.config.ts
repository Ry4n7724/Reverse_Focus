import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { icons, LucideAngularModule } from "lucide-angular";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withHashLocation()),
        provideEventPlugins(),
        importProvidersFrom(
            LucideAngularModule.pick(icons)
        )
    ]
};
