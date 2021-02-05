import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandmarkPreviewComponent } from './landmark-preview.component';

describe('LandmarkPreviewComponent', () => {
  let component: LandmarkPreviewComponent;
  let fixture: ComponentFixture<LandmarkPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandmarkPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandmarkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
