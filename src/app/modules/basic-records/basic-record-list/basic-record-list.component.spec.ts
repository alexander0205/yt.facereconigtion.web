import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRecordListComponent } from './basic-record-list.component';

describe('BasicRecordListComponent', () => {
  let component: BasicRecordListComponent;
  let fixture: ComponentFixture<BasicRecordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicRecordListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
