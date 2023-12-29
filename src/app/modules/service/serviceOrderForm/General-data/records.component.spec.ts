import { ComponentFixture, TestBed } from '@angular/core/testing';

import { serviceOrderForm } from './serviceOrderForm.component';

describe('serviceOrderForm', () => {
  let component: serviceOrderForm;
  let fixture: ComponentFixture<serviceOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [serviceOrderForm]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(serviceOrderForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
