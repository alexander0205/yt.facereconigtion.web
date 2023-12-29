import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWarningComponent } from './save-warning.component';

describe('SaveWarningComponent', () => {
  let component: SaveWarningComponent;
  let fixture: ComponentFixture<SaveWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
