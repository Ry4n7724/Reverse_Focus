import { commonTestProviders } from '../testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Todo } from './todo';

describe('Todo', () => {
  let component: Todo;
  let fixture: ComponentFixture<Todo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todo],
      providers: [...commonTestProviders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Todo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
