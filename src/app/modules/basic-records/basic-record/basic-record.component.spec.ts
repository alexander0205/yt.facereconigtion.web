import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRecordComponent } from './basic-record.component';

describe('BasicRecordComponent', () => {
  let component: BasicRecordComponent;
  let fixture: ComponentFixture<BasicRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
