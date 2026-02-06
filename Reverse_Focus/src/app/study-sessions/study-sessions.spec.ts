import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySessions } from './study-sessions';

describe('StudySessions', () => {
  let component: StudySessions;
  let fixture: ComponentFixture<StudySessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudySessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudySessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
