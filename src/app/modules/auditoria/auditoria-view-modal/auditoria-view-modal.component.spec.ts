import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditoriaViewModalComponent } from './auditoria-view-modal.component';

describe('AuditoriaViewModalComponent', () => {
  let component: AuditoriaViewModalComponent;
  let fixture: ComponentFixture<AuditoriaViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaViewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
