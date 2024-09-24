import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrdersManagementComponent } from './seller-orders-management.component';

describe('SellerOrdersManagementComponent', () => {
  let component: SellerOrdersManagementComponent;
  let fixture: ComponentFixture<SellerOrdersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOrdersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
