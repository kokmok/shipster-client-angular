import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthService } from '@/auth/auth-service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideAppInitializer(() => {
            const authService = inject(AuthService);
            return firstValueFrom(authService.init());
        })
    ]
};
