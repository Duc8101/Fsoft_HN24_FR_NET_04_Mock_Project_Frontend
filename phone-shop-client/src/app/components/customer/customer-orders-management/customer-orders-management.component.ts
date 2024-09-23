import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { CartItem } from '../../../models/cart';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { OrderDto } from '../../../models/orderDto';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-customer-orders-management',
  standalone: true,
  imports: [TabViewModule,
    CommonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    FormsModule,
    PaginatorModule,
    ConfirmPopupModule,
    DialogModule
  ],
  templateUrl: './customer-orders-management.component.html',
  styleUrl: './customer-orders-management.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class CustomerOrdersManagementComponent implements OnInit {

  constructor(private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {

  }

  tabs: string[] = [];
  orderList: OrderDto[] = [
    {
      orderId: 1,
      customerId: 101,
      username: "johndoe",
      status: "Pending",
      address: "123 Main St, City A",
      note: "Deliver before noon",
      orderDate: "2024-09-23",
    },
    {
      orderId: 2,
      customerId: 102,
      username: "janedoe",
      status: "Rejected",
      address: "456 Elm St, City B",
      note: "Leave at the back door",
      orderDate: "2024-09-22",
    },
    {
      orderId: 3,
      customerId: 103,
      username: "mikesmith",
      status: "Approved",
      address: "789 Oak St, City C",
      note: "Call before delivery",
      orderDate: "2024-09-21",
    },
    {
      orderId: 4,
      customerId: 104,
      username: "anndoe",
      status: "Done",
      address: "101 Pine St, City D",
      note: "Please hurry",
      orderDate: "2024-09-20",
    },
    {
      orderId: 5,
      customerId: 105,
      username: "tomjohnson",
      status: "Ship Fail",
      address: "555 Birch St, City E",
      note: "Reschedule delivery",
      orderDate: "2024-09-19",
    }
  ];

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

  selectStatus?: string;
  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;
  activeIndex: number = 0;
  totalPrice: number = 0;
  visible: boolean = false;
  currentOrderId: number = 0;

  ngOnInit() {
    this.tabs = [
      "All",
      "Pending",
      "Rejected",
      "Approved",
      "Done",
      "Ship Fail"
    ];
  }

  getOrders() {
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 10);
    parameters.set("currentPage", this.pageNum + 1);
    parameters.set("status", this.selectStatus);


    this.apiService
      .get('http://localhost:5125/Order/List', parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.orderList = response.data.list;
            this.totalItem = response.data.totalElement;
          } else {
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  getOrderDetail(orderId : number){
    // get order detail;
    this.currentOrderId = orderId;
    this.totalPrice = this.cartItems.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    this.showDialog();
  }

  onTabChange() {
    console.log(this.activeIndex);
    switch (this.activeIndex) {
      case 0:
        this.selectStatus = "";
        break;
      case 1:
        this.selectStatus = "Pending";
        break;
      case 2:
        this.selectStatus = "Rejected";
        break;
      case 3:
        this.selectStatus = "Approved";
        break;
      case 4:
        this.selectStatus = "Done";
        break;
      case 5:
        this.selectStatus = "Ship_Fail";
        break;
      default:
        this.selectStatus = "All";
        break;
    }

    this.pageNum = 0;
    this.getOrders();
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 9;
    }
    this.getOrders();
  }

  deleteOrder(orderId: number) {
    // delete order.
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this order?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Order deleted', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  showDialog() {
    this.visible = true;
  }
}
