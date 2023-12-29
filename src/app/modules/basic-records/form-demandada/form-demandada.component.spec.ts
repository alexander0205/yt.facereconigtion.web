import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemandadaComponent } from './form-demandada.component';

describe('FormDemandadaComponent', () => {
  let component: FormDemandadaComponent;
  let fixture: ComponentFixture<FormDemandadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDemandadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDemandadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
