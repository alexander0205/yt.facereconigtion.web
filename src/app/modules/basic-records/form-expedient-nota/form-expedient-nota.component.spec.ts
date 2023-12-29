import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpedientNotaComponent } from './form-expedient-nota.component';

describe('FormExpedientNotaComponent', () => {
  let component: FormExpedientNotaComponent;
  let fixture: ComponentFixture<FormExpedientNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExpedientNotaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExpedientNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
