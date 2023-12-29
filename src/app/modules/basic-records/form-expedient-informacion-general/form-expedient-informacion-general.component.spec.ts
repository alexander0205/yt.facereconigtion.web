import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpedientInformacionGeneralComponent } from './form-expedient-informacion-general.component';

describe('FormExpedientInformacionGeneralComponent', () => {
  let component: FormExpedientInformacionGeneralComponent;
  let fixture: ComponentFixture<FormExpedientInformacionGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExpedientInformacionGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExpedientInformacionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
