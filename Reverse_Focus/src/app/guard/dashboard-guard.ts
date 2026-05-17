import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session-database/session-service';
import { inject } from '@angular/core';

export const dashboardGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const hasActive = await sessionService.hasActiveSession();
  const isDashboardRoute = state.url.startsWith('/dashboard');

  if (isDashboardRoute && !hasActive) {
    return router.createUrlTree(['/']);
  }
  if (!isDashboardRoute && hasActive) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};

