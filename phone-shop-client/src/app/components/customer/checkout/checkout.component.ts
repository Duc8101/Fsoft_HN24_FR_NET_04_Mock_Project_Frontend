import { Component } from '@angular/core';
import { CartItem } from '../../../models/cart';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ApiService } from '../../../services/api/api.services';
import { UserInfo } from '../../../models/userInformation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { Table, TableModule } from 'primeng/table';
import { ToastService } from '../../../services/toastService';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ButtonModule,
    DividerModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule,
    CascadeSelectModule,
    InputMaskModule,
    DropdownModule,
    ChipsModule,
    TableModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [ToastService]
})
export class CheckoutComponent {
  cartitems: CartItem[] = [];
  totalPrice : number = 0;
  userInfo: UserInfo = {
    userId: 1,
    username: "user1",
    fullName : "Nguyen Quoc Duoc",
    phone : "0966390661",
    email : "duocdeptrai@gmail.com",
    address: "Tu son",
    cartItems: [],
  };

  constructor(private router: Router,
    private readonly apiService: ApiService,
    private toastService: ToastService
  ) { 
    const navigation = this.router.getCurrentNavigation();
    this.cartitems = navigation?.extras?.state?.['products'] || [];
    this.userInfo.cartItems = this.cartitems;
    this.totalPrice = this.cartitems.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  ngOnInit(): void {
    console.log(this.cartitems);
    this.getUserInfo();
  }

  getUserInfo(){
    this.apiService
      .get('http://localhost:5125/User/Detail', null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.userInfo = response.data;
            console.log(this.userInfo)
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!");
        }
      );
  }
  
  checkOut(){
    console.log(this.userInfo);
    // call api create order
    this.apiService
    .post('http://localhost:5125/Order/Create', this.userInfo, null)
    .subscribe(
      (response) => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          this.toastService.showSuccess("Check out success!");
        } else {
          this.toastService.showError(message);
        }
      },

      (error) => {
        this.toastService.showError("Something went wrong!");
      }
    );
  }
}
