import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.services';
import { ApiUrls } from '../../services/api/api-url';
import { Product } from '../../models/product';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toastService';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DividerModule,
    ImageModule,
    RatingModule,
    FormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  providers: [ToastService]
})
export class ProductDetailComponent implements OnInit {
  error = "";
  productId!: number;
  product: Product = {
    productId: 0,
    categoryName: "",
    productName: "",
    image: "",
    price: 0,
    categoryId: 0,
    quantity: 0,
    description: "",
    rate: 0
  };
  constructor(private route: ActivatedRoute, private apiService: ApiService, private dataService: DataService, private toastService: ToastService) {

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    });
    this.getData()
    this.getFeedBack();
    console.log(this.feedbacks);
  }

  getData() {
    this.apiService
      .get(ApiUrls.URL_GET_PRODUCT_DETAIL + "/" + this.productId, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.product = response.data;
          } else {
            this.error = message;
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  addToCart(id: number) {
    let body = {
      productId: id
    }

    this.apiService
      .post(ApiUrls.URL_CART_CREATE, body, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.dataService.setListCart();
            this.toastService.showSuccess("Add to cart success!");
          } else {
            this.toastService.showError(message);
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!");
        }
      );
  }

  displayFeedbackList: boolean = false;
  feedbacks: any[] = [];
  replyContent: string = '';
  replyList: any[] = [];
  selectedFeedback: any;
  displayReplyModal: boolean = false;
  currentProduct: number = 0;

  getFeedBack() {
    let parameters: Map<string, any> = new Map();
    parameters.set("productId", this.productId);

    this.apiService
      .get('http://localhost:5125/Feedback/get-feedbacks-by-product-id', parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.feedbacks = response.data;
            console.log(this.feedbacks)
            this.displayFeedbackList = true
          } else {
            this.error = message;
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  openReplyModal(feedback: any) {
    this.selectedFeedback = feedback;
    this.replyList = feedback.feedBackReplies;
    this.displayReplyModal = true;
  }
}
