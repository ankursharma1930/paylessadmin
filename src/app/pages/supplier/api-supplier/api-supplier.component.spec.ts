import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSupplierComponent } from './api-supplier.component';

describe('ApiSupplierComponent', () => {
  let component: ApiSupplierComponent;
  let fixture: ComponentFixture<ApiSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
