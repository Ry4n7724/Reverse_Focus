import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionPage } from './create-session-page';

describe('CreateSessionPage', () => {
  let component: CreateSessionPage;
  let fixture: ComponentFixture<CreateSessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSessionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
