import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByDateRangeReportComponent } from './by-date-range-report.component';

describe('ByDateRangeReportComponent', () => {
  let component: ByDateRangeReportComponent;
  let fixture: ComponentFixture<ByDateRangeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByDateRangeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByDateRangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
