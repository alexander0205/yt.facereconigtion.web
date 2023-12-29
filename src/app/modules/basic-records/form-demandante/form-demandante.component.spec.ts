import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemandanteComponent } from './form-demandante.component';

describe('FormDemandanteComponent', () => {
  let component: FormDemandanteComponent;
  let fixture: ComponentFixture<FormDemandanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDemandanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDemandanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
