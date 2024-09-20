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
    PaginatorModule
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
  minPrice: number = 0;
  maxPrice: number = 9999999;
  name: string = "";
  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;

  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router
  ) { }

  ngOnInit() {
    this.getData();
    this.getCategories();
    this.minPrice = 0;
    this.maxPrice = 0;
  }

  getData() {
    //?pageSize=10&currentPage=1
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 9);
    parameters.set("currentPage", this.pageNum + 1);
    parameters.set("priceFrom", this.minPrice);
    parameters.set("priceTo", this.maxPrice === 0 ? 99999 : this.maxPrice);
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
}

