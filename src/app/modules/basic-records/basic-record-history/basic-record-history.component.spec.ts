import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRecordHistoryComponent } from './basic-record-history.component';

describe('BasicRecordHistoryComponent', () => {
  let component: BasicRecordHistoryComponent;
  let fixture: ComponentFixture<BasicRecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicRecordHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicRecordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
