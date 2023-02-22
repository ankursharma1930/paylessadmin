import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoCategoryComponent } from './seo-category.component';

describe('SeoCategoryComponent', () => {
  let component: SeoCategoryComponent;
  let fixture: ComponentFixture<SeoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeoCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
