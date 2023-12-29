import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArchivosPruebaComponent } from './form-archivos-prueba.component';

describe('FormArchivosPruebaComponent', () => {
  let component: FormArchivosPruebaComponent;
  let fixture: ComponentFixture<FormArchivosPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormArchivosPruebaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormArchivosPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
