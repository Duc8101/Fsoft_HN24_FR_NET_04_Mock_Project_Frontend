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
import { ToastService } from '../../../services/toastService';
import { OrderDetail } from '../../../models/orderDetail';

@Component({
  selector: 'app-seller-orders-management',
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
  templateUrl: './seller-orders-management.component.html',
  styleUrl: './seller-orders-management.component.scss',
  providers: [ConfirmationService, ToastService]
})
export class SellerOrdersManagementComponent implements OnInit {

  constructor(private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {

  }

  tabs: string[] = [
    "All",
    "Pending",
    "Rejected",
    "Approved",
    "Done",
    "Ship Failed"
  ];

  statusEnum: string[] = [
    "Pending",
    "Rejected",
    "Approved",
    "Done",
    "Ship Failed"
  ];
  orderList: OrderDto[] = [];
  orderDetail: OrderDetail[] = [];

  selectStatus?: string = "";
  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;
  activeIndex: number = 0;
  totalPrice: number = 0;
  visible: boolean = false;
  currentOrderId: number = 0;
  displayConfirmation: boolean = false;
  selectedOrder: any;
  pendingStatusChange: string = "";
  previousStatus: string = "";
  note: string = '';

  ngOnInit() {
    this.getOrders();
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

  getOrderDetail(orderId: number) {
    // get order detail;
    this.currentOrderId = orderId;
    this.apiService
      .get('http://localhost:5125/Order/Detail/' + orderId, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.orderDetail = response.data;
            this.totalPrice = this.orderDetail.reduce((sum, product) => sum + (product.price * product.quantity), 0);
          } else {
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );

    this.showDialog();
  }

  onTabChange() {
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
        this.selectStatus = "Ship Failed";
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


  showDialog() {
    this.visible = true;
  }

  onStatusChange(newStatus: any, order: any) {
    this.previousStatus = order.status;
    this.pendingStatusChange = newStatus.value;
    this.selectedOrder = order;
    this.displayConfirmation = true;
  }


  confirmChange() {
    this.selectedOrder.status = this.pendingStatusChange;
    console.log(this.pendingStatusChange);
    let status = 0;
    switch (this.pendingStatusChange) {
      case "Pending":
        status = 0;
        break;
      case "Rejected":
        status = 1;
        break;
      case "Approved":
        status = 2;
        break;
      case "Done":
        status = 3;
        break;
      case "Ship Failed":
        status = 4;
        break;
    }

    let body = {
      status: status,
      note: this.note,
    }

    this.apiService
      .put('http://localhost:5125/Order/Update/' + this.selectedOrder.orderId, body)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.toastService.showSuccess(message);
            this.getOrders();
          } else {
            this.toastService.showError(message);
            this.getOrders();
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!");
          this.getOrders();
        }
      );

    this.displayConfirmation = false;
    this.note = '';
    this.selectedOrder = null;
  }

  // Khi người dùng từ chối thay đổi
  rejectChange() {
    this.getOrders();
    this.displayConfirmation = false;  // Đóng dialog
    this.note = '';
    this.selectedOrder = null;
  }
}

