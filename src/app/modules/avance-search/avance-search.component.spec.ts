import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceSearchComponent } from './avance-search.component';

describe('AvanceSearchComponent', () => {
  let component: AvanceSearchComponent;
  let fixture: ComponentFixture<AvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
