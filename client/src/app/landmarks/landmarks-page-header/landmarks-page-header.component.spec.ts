import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandmarksPageHeaderComponent } from './landmarks-page-header.component';

describe('LandmarksPageHeaderComponent', () => {
  let component: LandmarksPageHeaderComponent;
  let fixture: ComponentFixture<LandmarksPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandmarksPageHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandmarksPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
