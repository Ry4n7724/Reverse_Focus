import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionService } from '../session-database/session-service';

import { dashboardGuard } from './dashboard-guard';

describe('dashboardGuard', () => {
  let sessionService: { hasActiveSession: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => dashboardGuard(...guardParameters));

  beforeEach(() => {
    sessionService = { hasActiveSession: vi.fn() };
    router = { createUrlTree: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should redirect root to dashboard when active session exists', async () => {
    sessionService.hasActiveSession.mockResolvedValue(true);
    router.createUrlTree.mockReturnValue(new UrlTree());

    const result = await executeGuard({} as any, { url: '/' } as any);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBeInstanceOf(UrlTree);
  });

  it('should allow root when no active session', async () => {
    sessionService.hasActiveSession.mockResolvedValue(false);

    const result = await executeGuard({} as any, { url: '/' } as any);

    expect(result).toBe(true);
  });

  it('should allow dashboard when active session exists', async () => {
    sessionService.hasActiveSession.mockResolvedValue(true);

    const result = await executeGuard({} as any, { url: '/dashboard' } as any);

    expect(result).toBe(true);
  });

  it('should redirect dashboard to root when no active session', async () => {
    sessionService.hasActiveSession.mockResolvedValue(false);
    router.createUrlTree.mockReturnValue(new UrlTree());

    const result = await executeGuard({} as any, { url: '/dashboard' } as any);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBeInstanceOf(UrlTree);
  });
});
