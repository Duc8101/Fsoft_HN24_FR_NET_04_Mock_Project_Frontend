import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersManagementComponent } from './customer-orders-management.component';

describe('CustomerOrdersManagementComponent', () => {
  let component: CustomerOrdersManagementComponent;
  let fixture: ComponentFixture<CustomerOrdersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrdersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
