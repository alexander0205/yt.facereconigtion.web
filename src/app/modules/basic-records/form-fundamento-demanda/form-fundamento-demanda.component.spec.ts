import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFundamentoDemandaComponent } from './form-fundamento-demanda.component';

describe('FormFundamentoDemandaComponent', () => {
  let component: FormFundamentoDemandaComponent;
  let fixture: ComponentFixture<FormFundamentoDemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFundamentoDemandaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFundamentoDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
