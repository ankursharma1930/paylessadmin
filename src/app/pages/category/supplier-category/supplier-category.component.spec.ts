import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCategoryComponent } from './supplier-category.component';

describe('SupplierCategoryComponent', () => {
  let component: SupplierCategoryComponent;
  let fixture: ComponentFixture<SupplierCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
