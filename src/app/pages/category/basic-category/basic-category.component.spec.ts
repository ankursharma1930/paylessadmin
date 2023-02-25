import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCategoryComponent } from './basic-category.component';

describe('BasicCategoryComponent', () => {
  let component: BasicCategoryComponent;
  let fixture: ComponentFixture<BasicCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
