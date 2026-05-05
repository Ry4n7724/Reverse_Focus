import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownComponent } from './countdown-component';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
