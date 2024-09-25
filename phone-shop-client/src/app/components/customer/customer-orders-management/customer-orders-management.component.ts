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
import { RatingModule } from 'primeng/rating';

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
    DialogModule,
    RatingModule,
  ],
  templateUrl: './customer-orders-management.component.html',
  styleUrl: './customer-orders-management.component.scss',
  providers: [ConfirmationService, ToastService]
})
export class CustomerOrdersManagementComponent implements OnInit {

  constructor(private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {

  }

  tabs: string[] = [];
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
  displayFeedbackModal: boolean = false;
  rating: number = 5;
  comment: string = '';
  currentOrderDetailId : number = 0;

  ngOnInit() {
    this.tabs = [
      "All",
      "Pending",
      "Rejected",
      "Approved",
      "Done",
      "Ship Fail"
    ];

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
            console.log(response.data.list);
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
            console.log(this.orderDetail);
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

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this order?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.toastService.showSuccess("Success!");
      },
      reject: () => {
        this.toastService.showWarn("Reject!");
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  showFeedback(orderDetailId : number){
    this.displayFeedbackModal = true;
    this.currentOrderDetailId = orderDetailId;
  }

  // Gửi phản hồi
  submitFeedback() {
    // Bạn có thể xử lý dữ liệu phản hồi tại đây (gửi về server, lưu vào database,...)
    let body = {
      comment: this.comment,
      orderDetailId: this.currentOrderDetailId,
      rate: this.rating,
    }

    this.apiService
      .post('http://localhost:5125/Feedback/create-feedback', body, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.toastService.showSuccess("Feedback success!")
            this.getOrderDetail(this.currentOrderId);
          } else {
            this.toastService.showError(message)
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!")
        }
      );


    // Đóng modal sau khi gửi phản hồi
    this.displayFeedbackModal = false;
    this.clearFeedback();
  }

  // Xóa dữ liệu phản hồi sau khi đóng modal
  clearFeedback() {
    this.rating = 5;
    this.comment = '';
  }
}
