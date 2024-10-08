import { Component, inject, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../models/product';
import { ApiService } from '../../../services/api/api.services';
import { ApiUrls } from '../../../services/api/api-url';
import { Category } from '../../../models/category';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toastService';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { from, Observable, switchMap } from 'rxjs';


@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    PaginatorModule,
    DialogModule,
    ReactiveFormsModule,
    AngularFireStorageModule
  ],
  providers: [ToastService],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  private storage = inject(AngularFireStorage);
  error = '';

  statusButton = 'Add';

  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  categories: Category[] = [];

  isUpdate: boolean = false;

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

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  pageNum: number = 0;

  first: number = 0;

  totalItem: number = 0;

  name: string = "";

  form: FormGroup;

  constructor(private readonly apiService: ApiService, private toastService: ToastService,
  ) {
    this.form = new FormGroup({
      quantity: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 10;
    }
    this.getListProduct();
  }


  ngOnInit() {
    this.getListProduct();
    this.getListCategory();
  }

  openNew() {
    this.product = {
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
    this.submitted = false;
    this.productDialog = true;
    this.isUpdate = false;
  }

  deleteSelectedProducts() {
    this.deleteProductsDialog = true;
  }

  openUpdateProduct(productUpdate: Product) {
    this.productDialog = true;
    this.isUpdate = true;
    this.product.productId = productUpdate.productId;
    this.product.productName = productUpdate.productName;
    this.product.categoryId = productUpdate.categoryId;
    this.product.categoryName = productUpdate.categoryName;
    this.product.image = productUpdate.image;
    this.product.description = productUpdate.description;
    this.product.quantity = productUpdate.quantity;
    this.product.price = productUpdate.price;
  }

  openDeleteProduct(productDelete: Product) {
    this.deleteProductDialog = true;
    this.product.productId = productDelete.productId;
    this.product.productName = productDelete.productName;
    this.product.categoryId = productDelete.categoryId;
    this.product.categoryName = productDelete.categoryName;
    this.product.image = productDelete.image;
    this.product.description = productDelete.description;
    this.product.quantity = productDelete.quantity;
    this.product.price = productDelete.price;
  }


  confirmDeleteSelected() {
    this.deleteProductsDialog = false;
  }


  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  showSuccess(action: string) {
    this.toastService.showSuccess(action + 'Success!');
  }

  showError(action: string) {
    this.toastService.showError(action + ' Failed!');
  }

  // saveProduct() {
  //     this.submitted = true;

  //     if (this.product.productName?.trim()) {
  //       this.apiService
  //       .post(ApiUrls.URL_CREATE_PRODUCT,[this.])
  //       .subscribe(
  //         (response) => {
  //           const code = response.code;
  //           const message = response.message;
  //           if (code === 200) {
  //             this.products = response.data.list;
  //           } else {
  //             this.error = message;
  //           }
  //         },
  //         (error) => {
  //           console.error('Có lỗi xảy ra : ', error);
  //         }
  //       );

  //         this.products = [...this.products];
  //         this.productDialog = false;
  //         this.product = {productId: 0,
  //           categoryName: "",
  //           productName: "",
  //           image: "",
  //           price: 0,
  //           categoryId: 0,
  //           rate: 0,
  //           quantity: 0,
  //           description: ""};
  //     }
  // }

  getListProduct() {
    let parameters: Map<string, any> = new Map();
    parameters.set("name", this.name);
    parameters.set("pageSize", 10);
    parameters.set("currentPage", this.pageNum + 1);


    this.apiService
      .post(ApiUrls.URL_GET_ALL_PRODUCTS, [], parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.products = response.data.list;
            this.totalItem = response.data.totalElement;
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  };

  getListCategory() {
    this.apiService
      .get(ApiUrls.URL_GET_ALL_CATEGORIES, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.categories = response.data;

          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  };

  createProduct() {
    this.submitted = true;
    this.apiService
      .post(ApiUrls.URL_CREATE_PRODUCT, this.product, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
            this.showSuccess("Add Product");
          } else {
            this.error = message;
            this.showError("Add Product");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
    this.products = [...this.products];
    this.productDialog = false;
    this.product = {
      productId: 0,
      categoryName: "",
      productName: "",
      image: "",
      price: 0,
      categoryId: 0,
      rate: 0,
      quantity: 0,
      description: ""
    };
  }

  updateProduct() {
    this.submitted = true;
    this.apiService
      .put(ApiUrls.URL_UPDATE_PRODUCT + "/" + this.product.productId, this.product)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
            this.showSuccess("Update Product");
          } else {
            this.error = message;
            this.showError("Update Product");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
    this.products = [...this.products];
    this.productDialog = false;
    this.product = {
      productId: 0,
      categoryName: "",
      productName: "",
      image: "",
      price: 0,
      categoryId: 0,
      rate: 0,
      quantity: 0,
      description: ""
    };

  };

  deleteProduct(id: number) {
    this.apiService
      .delete(ApiUrls.URL_DELETE_PRODUCT + "/" + id, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
            this.showSuccess("Delete Product");
          } else {
            this.error = message;
            this.showError("Delete Product");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );

    this.deleteProductDialog = false;
  }


  onGlobalFilter(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
    this.getListProduct();
  }

  displayFeedbackList: boolean = false;
  feedbacks: any[] = [];
  replyContent: string = '';
  replyList: any[] = [];
  selectedFeedback: any;
  displayReplyModal: boolean = false;
  currentProduct: number = 0;

  getFeedBack(productId: number) {
    let parameters: Map<string, any> = new Map();
    this.currentProduct = productId;
    parameters.set("productId", productId);

    this.apiService
      .get('http://localhost:5125/Feedback/get-feedbacks-by-product-id', parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.feedbacks = response.data;
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

  // Hàm xử lý khi nhấn nút Reply
  replyToFeedback(feedback: any) {
    this.replyList = feedback.feedBackReplies;
    this.openReplyModal(feedback);
  }

  // Hàm mở modal reply khi nhấn vào Reply
  openReplyModal(feedback: any) {
    this.selectedFeedback = feedback;  // Lưu feedback được chọn
    this.displayReplyModal = true;     // Mở modal reply
  }

  // Hàm gửi phản hồi
  submitReply() {
    let body = {
      repliedFeedbackId: this.selectedFeedback.feedbackId,
      comment: this.replyContent,
    }

    this.apiService
      .post('http://localhost:5125/Feedback/reply-feedback', body, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.toastService.showSuccess(message);
            this.getFeedBack(this.currentProduct);
          } else {
            this.toastService.showError(message);
          }
        },

        (error) => {
          this.toastService.showError("Something went wrong!");
        }
      );

    this.displayReplyModal = false;
    this.replyContent = '';
  }

  cancelReply() {
    this.displayReplyModal = false;
    this.replyContent = '';
  }

  uploadFile(file: File): Observable<string> {
    const filePath = `uploads/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return from(task).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  }

  downloadURL: string | null = null;


  onUpload(event: any) {
    const file = event.files[0];
    console.log("abc");
    if (file) {
      this.uploadFile(file).subscribe({
        next: (url) => {
          this.product.image = url;
          this.toastService.showSuccess("Success");
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.toastService.showError("Error");
        }
      });
    }
  }
}
