import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpedientEstadosComponent } from './form-expedient-estados.component';

describe('FormExpedientEstadosComponent', () => {
  let component: FormExpedientEstadosComponent;
  let fixture: ComponentFixture<FormExpedientEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExpedientEstadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExpedientEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
