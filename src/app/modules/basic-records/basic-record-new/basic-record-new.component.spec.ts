import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRecordNewComponent } from './basic-record-new.component';

describe('BasicRecordNewComponent', () => {
  let component: BasicRecordNewComponent;
  let fixture: ComponentFixture<BasicRecordNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicRecordNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicRecordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
