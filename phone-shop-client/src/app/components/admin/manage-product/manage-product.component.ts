import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
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


@Component({
  selector: 'app-manage-category',
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
    DialogModule
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
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

  constructor(private readonly apiService: ApiService) { }

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
  }

  deleteSelectedProducts() {
      this.deleteProductsDialog = true;
  }

  openUpdateProduct(product: Product) {
      this.productDialog = true;
      this.isUpdate = true; 
  }

  openDeleteProduct(){
    this.deleteProductDialog = true;
  }


  confirmDeleteSelected() {
      this.deleteProductsDialog = false;
  }

  confirmDelete() {
      this.deleteProductDialog = false;
      this.products = this.products.filter(val => val.productId !== this.product.productId);
      this.product = {
        productId: 0,
        categoryName: "",
        productName: "",
        image: "",
        price: 0,
        categoryId: 0,
        quantity: 0,
        description: "",
        rate : 0
      };
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
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

  getListProduct(){
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 10);
    parameters.set("currentPage", 1);

    this.apiService
      .post(ApiUrls.URL_GET_ALL_PRODUCTS,[], parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.products = response.data.list;
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  };
  
  getListCategory(){
    this.apiService
      .get(ApiUrls.URL_GET_ALL_CATEGORIES,null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.categories = response.data;
            console.log(this.categories)
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  };

  createProduct(){
    this.submitted = true;
    this.apiService
      .post(ApiUrls.URL_CREATE_PRODUCT,this.product,null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
      this.products = [...this.products];
          this.productDialog = false;
          this.product = {productId: 0,
            categoryName: "",
            productName: "",
            image: "",
            price: 0,
            categoryId: 0,
            rate: 0,
            quantity: 0,
            description: ""};
  }

  updateProduct(){
    this.submitted = true;
    console.log(this.product)
    this.apiService
      .put(ApiUrls.URL_UPDATE_PRODUCT+"/"+this.product.productId,this.product)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
      this.products = [...this.products];
          this.productDialog = false;
          this.product = {productId: 0,
            categoryName: "",
            productName: "",
            image: "",
            price: 0,
            categoryId: 0,
            rate: 0,
            quantity: 0,
            description: ""};
    this.isUpdate = false;
  };

  deleteProduct(id: number){
    let parameters: Map<string, any> = new Map();
    parameters.set("productId", id);
    console.log(id)

    this.apiService
      .delete(ApiUrls.URL_DELETE_PRODUCT+"/"+id,null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListProduct();
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  chooseProduct(id: number){
    let findProduct = this.products.find(p => p.productId == id)
    if(findProduct){
        this.product = findProduct;
    }
    this.statusButton = "Update";
  }
}
