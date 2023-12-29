import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHistoryComponent } from './auditoria-history.component';

describe('AuditoriaHistoryComponent', () => {
  let component: AuditoriaHistoryComponent;
  let fixture: ComponentFixture<AuditoriaHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
