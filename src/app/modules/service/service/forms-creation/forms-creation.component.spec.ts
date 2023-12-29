import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsCreationComponent } from './forms-creation.component';

describe('FormsCreationComponent', () => {
  let component: FormsCreationComponent;
  let fixture: ComponentFixture<FormsCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsCreationComponent]
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
