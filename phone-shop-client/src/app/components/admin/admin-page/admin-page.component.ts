import { Component } from '@angular/core';
import { ManageProductComponent } from "../manage-product/manage-product.component";
import { ManageCategoryComponent } from "../manage-category/manage-category.component";
import { DividerModule } from 'primeng/divider';
import { SellerOrdersManagementComponent } from "../seller-orders-management/seller-orders-management.component";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ManageProductComponent, ManageCategoryComponent, DividerModule, SellerOrdersManagementComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {
  model: string = '';

  chooseManagement(modelChoose: string){
    this.model = modelChoose;
  }
}
