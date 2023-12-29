import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesHistoryComponent } from './notes-history.component';

describe('NotesHistoryComponent', () => {
  let component: NotesHistoryComponent;
  let fixture: ComponentFixture<NotesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
