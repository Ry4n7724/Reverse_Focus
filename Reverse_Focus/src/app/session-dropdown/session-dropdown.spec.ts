import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDropdown } from './session-dropdown';

describe('SessionDropdown', () => {
  let component: SessionDropdown;
  let fixture: ComponentFixture<SessionDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
