import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../session-database/session-service';
import { ConfirmService } from '../shared/confirm';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let sessionService: { getSessions: ReturnType<typeof vi.fn>; updateSession: ReturnType<typeof vi.fn> };
  let confirm: { ask: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const work = { id: 1, sessionName: 'Work', icon: 'briefcase', urls: ['https://github.com', 'docs.google.com'], active: true };

  beforeEach(async () => {
    sessionService = { getSessions: vi.fn().mockResolvedValue([work]), updateSession: vi.fn() };
    confirm = { ask: vi.fn().mockResolvedValue(true) };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: ConfirmService, useValue: confirm },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await component.ngOnInit();
  });

  it('should load active sessions and their sites', () => {
    expect(component.activeSessions()).toEqual([work] as any);
    expect(component.unblockedSites().map(s => s.domain)).toEqual(['github.com', 'docs.google.com']);
    expect(component.sessionTitle()).toBe('Work');
  });

  it('should add a protocol to stored entries that lack one', () => {
    expect(component.withProtocol('docs.google.com')).toBe('https://docs.google.com');
    expect(component.withProtocol('http://example.com')).toBe('http://example.com');
  });

  it('should deactivate sessions and navigate after confirming', async () => {
    await component.unfocus();

    expect(sessionService.updateSession).toHaveBeenCalledWith(1, { active: false });
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });

  it('should keep the session when the user cancels', async () => {
    confirm.ask.mockResolvedValue(false);

    await component.unfocus();

    expect(sessionService.updateSession).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
