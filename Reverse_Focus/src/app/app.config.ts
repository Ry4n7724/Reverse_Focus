import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { icons, LucideAngularModule } from "lucide-angular";
import { APP_BASE_HREF } from "@angular/common";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideEventPlugins(),
        importProvidersFrom(
            LucideAngularModule.pick(icons)
        )
    ]
};
