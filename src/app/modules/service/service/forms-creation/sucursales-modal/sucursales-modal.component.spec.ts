import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesModalComponent } from './sucursales-modal.component';

describe('SucursalesModalComponent', () => {
  let component: SucursalesModalComponent;
  let fixture: ComponentFixture<SucursalesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
