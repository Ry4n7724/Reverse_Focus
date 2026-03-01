import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { icons, LucideAngularModule } from "lucide-angular";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideEventPlugins(),
        importProvidersFrom(
            LucideAngularModule.pick(icons) // ✅ allowed here
        )
    ]
};
