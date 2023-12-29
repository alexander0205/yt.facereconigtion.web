import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpedientHeaderComponent } from './form-expedient-header.component';

describe('FormExpedientHeaderComponent', () => {
  let component: FormExpedientHeaderComponent;
  let fixture: ComponentFixture<FormExpedientHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExpedientHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExpedientHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
