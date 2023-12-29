import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeFilesComponent } from './tree-files.component';

describe('TreeFilesComponent', () => {
  let component: TreeFilesComponent;
  let fixture: ComponentFixture<TreeFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
