import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullphotoComponent } from './fullphoto.component';

describe('FullphotoComponent', () => {
  let component: FullphotoComponent;
  let fixture: ComponentFixture<FullphotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullphotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullphotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
