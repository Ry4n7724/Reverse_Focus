import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../session-database/session-service';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let sessionService: { getSessions: ReturnType<typeof vi.fn>; hasActiveSession: ReturnType<typeof vi.fn>; updateSession: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    sessionService = {
      getSessions: vi.fn(),
      hasActiveSession: vi.fn(),
      updateSession: vi.fn(),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    sessionService.getSessions.mockResolvedValue([]);

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load active sessions on init', async () => {
    const sessions = [
      { id: 1, sessionName: 'Work', icon: 'briefcase', urls: ['https://github.com'], active: true },
    ];
    sessionService.getSessions.mockResolvedValue(sessions);

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.activeSessions).toEqual(sessions);
    expect(component.unblockedSites().length).toBe(1);
    expect(component.unblockedSites()[0].domain).toBe('github.com');
  });

  it('should deactivate sessions and navigate on unfocus', async () => {
    component.activeSessions = [
      { id: 1, sessionName: 'Work', icon: 'briefcase', urls: ['https://github.com'], active: true } as any,
    ];

    await component.unfocus();

    expect(sessionService.updateSession).toHaveBeenCalledWith(1, { active: false });
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });

  it('should redirect if no active session', async () => {
    sessionService.hasActiveSession.mockResolvedValue(false);

    await component.redirectIfNoActiveSession();

    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });

  it('should not redirect if active session exists', async () => {
    sessionService.hasActiveSession.mockResolvedValue(true);

    await component.redirectIfNoActiveSession();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
