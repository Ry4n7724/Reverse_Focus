import { commonTestProviders } from '../testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterPage } from './starter-page';

describe('StarterPage', () => {
  let component: StarterPage;
  let fixture: ComponentFixture<StarterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarterPage],
      providers: [...commonTestProviders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
