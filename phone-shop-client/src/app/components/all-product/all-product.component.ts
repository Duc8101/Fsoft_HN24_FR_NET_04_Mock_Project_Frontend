import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { SelectItem } from 'primeng/api';
import { ApiService } from '../../services/api/api.services';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { Category } from '../../models/category';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ApiUrls } from '../../services/api/api-url';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    DropdownModule,
    RatingModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    MultiSelectModule,
    InputNumberModule,
    TagModule,
    PaginatorModule,
    DialogModule
  ],
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.scss'
})
export class AllProductComponent implements OnInit {
  error = '';
  products: Product[] = [];
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  categories: Category[] = [];
  selectedCategories: number[] = [];
  minPrice?: number;
  maxPrice?: number;
  name: string = "";
  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;
  

  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router,
    private readonly dataService: DataService,
  ) { }

  ngOnInit() {
    this.getData();
    this.getCategories();
    this.minPrice = 0;
    this.maxPrice = 0;
  }

  addToCart(id: string){
    let body = {
      productId: id
    }

    console.log(id)
    this.apiService
    .post(ApiUrls.URL_CART_CREATE,body, null)
    .subscribe(
      (response) => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          this.dataService.setListCart();
        } else {
          this.error = message;
        }
      },

      (error) => {
        console.error('Có lỗi xảy ra : ', error);
      }
    );
  }

  getData() {
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 9);
    parameters.set("currentPage", this.pageNum + 1);
    parameters.set("priceFrom", this.minPrice ?? "");
    parameters.set("priceTo", this.maxPrice ?? "");
    parameters.set("name", this.name);

    this.apiService
      .post('http://localhost:5125/Product/get-all-products', this.selectedCategories, parameters)
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
  }

  getCategories() {
    this.apiService
      .get('http://localhost:5125/Category/get-all-categories', null)
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
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  Search() {
    this.pageNum = 0;
    this.getData();
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 9;
    }
    this.getData();
  }

  visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}

