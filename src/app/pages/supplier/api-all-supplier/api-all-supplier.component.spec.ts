import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAllSupplierComponent } from './api-all-supplier.component';

describe('ApiAllSupplierComponent', () => {
  let component: ApiAllSupplierComponent;
  let fixture: ComponentFixture<ApiAllSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiAllSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiAllSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
