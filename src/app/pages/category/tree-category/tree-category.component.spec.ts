import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeCategoryComponent } from './tree-category.component';

describe('TreeCategoryComponent', () => {
  let component: TreeCategoryComponent;
  let fixture: ComponentFixture<TreeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
