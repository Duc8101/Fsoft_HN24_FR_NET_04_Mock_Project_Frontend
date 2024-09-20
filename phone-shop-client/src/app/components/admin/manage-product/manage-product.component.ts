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

  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

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
    this.getData();
  }

  openNew() {
  //    this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.deleteProductsDialog = true;
  }

  editProduct(product: Product) {
      this.product = { ...product };
      this.productDialog = true;
  }

  deleteProduct(product: Product) {
      this.deleteProductDialog = true;
      this.product = { ...product };
  }

  confirmDeleteSelected() {
      this.deleteProductsDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.selectedProducts = [];
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

  saveProduct() {
      this.submitted = true;

      if (this.product.productName?.trim()) {
          if (this.product.productId) {
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
            //   this.products[this.findIndexById(this.product.productId)] = this.product;
          } else {
              this.product.image = 'product-placeholder.svg';
              // @ts-ignore
              this.products.push(this.product);
          }

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
  }

  getData(){
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 10);
    parameters.set("currentPage", 1);

    this.apiService
      .post('http://localhost:5125/Product/get-all-products',[], parameters)
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


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  chooseProduct(id: number){
    let findProduct = this.products.find(p => p.productId == id)
    if(findProduct){
        this.product = findProduct;
    }
    
  }
}
