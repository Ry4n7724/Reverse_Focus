import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteBlocker } from './website-blocker';

describe('WebsiteBlocker', () => {
  let component: WebsiteBlocker;
  let fixture: ComponentFixture<WebsiteBlocker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteBlocker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteBlocker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
