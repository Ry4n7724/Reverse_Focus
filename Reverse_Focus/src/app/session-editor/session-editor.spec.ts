import { commonTestProviders } from '../testing';
import { TestBed } from '@angular/core/testing';
import { SessionService } from '../session-database/session-service';

import { SessionEditor } from './session-editor';

describe('SessionEditor', () => {
  let sessionService: { addSession: ReturnType<typeof vi.fn>; updateSession: ReturnType<typeof vi.fn> };

  function create() {
    const fixture = TestBed.createComponent(SessionEditor);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(async () => {
    localStorage.clear();
    sessionService = { addSession: vi.fn().mockResolvedValue(1), updateSession: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [SessionEditor],
      providers: [...commonTestProviders, { provide: SessionService, useValue: sessionService }],
    }).compileComponents();
  });

  it('should split pasted entries, trim trailing slashes and ignore duplicates', () => {
    const component = create();

    component.urlInput.setValue('github.com/, stackoverflow.com  github.com');
    component.addUrls();

    expect(component.form.controls.urlList.value).toEqual(['github.com', 'stackoverflow.com']);
    expect(component.urlInput.value).toBe('');
  });

  it('should not save without a name', async () => {
    const component = create();

    await component.save();

    expect(sessionService.addSession).not.toHaveBeenCalled();
  });

  it('should create a session, including a URL typed but not yet added', async () => {
    const component = create();
    component.form.controls.sessionName.setValue('Study');
    component.urlInput.setValue('wikipedia.org');
    const saved = vi.fn();
    component.saved.subscribe(saved);

    await component.save();

    expect(sessionService.addSession).toHaveBeenCalledWith('Study', 'book', ['wikipedia.org'], false);
    expect(saved).toHaveBeenCalled();
    expect(localStorage.getItem('sessionFormState')).toBeNull();
  });

  it('should restore an unfinished draft', () => {
    localStorage.setItem('sessionFormState',
      JSON.stringify({ sessionName: 'Draft', icon: 'code', urlList: ['a.com'] }));

    const component = create();

    expect(component.form.getRawValue()).toEqual({ sessionName: 'Draft', icon: 'code', urlList: ['a.com'] });
  });
});
