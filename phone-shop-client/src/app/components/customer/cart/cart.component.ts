import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { CartItem } from '../../../models/cart';
import { MessageService } from 'primeng/api';
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
  providers: [MessageService]
})
export class CartComponent implements OnInit {
  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router,
    private messageService: MessageService
  ) { }

  cartItems: CartItem[] = [
    {
      productId: 1,
      cartId: 1,
      productName: 'Laptop',
      image: 'laptop.jpg',
      price: 1500,
      quantity: 2
    },
    {
      productId: 2,
      cartId: 1,
      productName: 'Phone',
      image: 'phone.jpg',
      price: 800,
      quantity: 1
    },
    {
      productId: 3,
      cartId: 1,
      productName: 'Headphones',
      image: 'headphones.jpg',
      price: 200,
      quantity: 3
    }
  ];
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
            this.cartItems = response.data.cartDetailDTOs;
            this.username = response.data.customer;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete cart item success' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
          }
        },

        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
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
