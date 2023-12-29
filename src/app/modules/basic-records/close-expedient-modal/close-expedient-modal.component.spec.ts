import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseExpedientModalComponent } from './close-expedient-modal.component';

describe('CloseExpedientModalComponent', () => {
  let component: CloseExpedientModalComponent;
  let fixture: ComponentFixture<CloseExpedientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseExpedientModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseExpedientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
