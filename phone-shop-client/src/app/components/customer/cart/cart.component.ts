import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { CartItem } from '../../../models/cart';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.services';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ToastModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [ToastService]
})
export class CartComponent implements OnInit {
  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router,
    private toastService: ToastService
  ) { }

  cartItems: CartItem[] = [];
  selectedProducts: CartItem[] = [];
  cols: any[] = [];
  totalPrice: number = 0;
  username: string = "";
  error = '';


  ngOnInit(): void {
    this.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'price', header: 'Price' },
    ];
    this.getCartItems();
  }

  getCartItems() {
    // call api get cart
    this.apiService
      .get('http://localhost:5125/Cart/List', null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.cartItems = response.data.cartDetailDTOs;
            this.username = response.data.customer;
          } else {
            this.error = message;
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  onQuantityChange(product : CartItem){
    console.log(product);
    this.apiService
    .put('http://localhost:5125/Cart/Update',product)
    .subscribe(
      (response) => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          this.selectChange();
        } else {
          this.error = message;
        }
      },

      (error) => {
        console.error('Có lỗi xảy ra : ', error);
      }
    );

    this.selectChange();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItem(productId: number) {
    // call api delete cart item
    let parameters: Map<string, any> = new Map();
    parameters.set("productId", productId);

    this.apiService
      .delete('http://localhost:5125/Cart/Delete', parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getCartItems();
            this.username = response.data.customer;
            this.toastService.showSuccess("Delete success!");
          } else {
            this.toastService.showError(message);
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!");
        }
      );
  }

  submit(){
    this.routers.navigate(['/checkout'], { state: { products: this.selectedProducts } });
  }

  selectChange(){
    this.totalPrice = this.selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }
}
