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
  categories : Category[] = [];
  selectedCategories : Category[] = [];
  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router
  ) {}

  ngOnInit() {
    this.getData();
    this.getCategories();

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }

  getData() {
    //?pageSize=10&currentPage=1
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 10);
    parameters.set("currentPage", 1);

    this.apiService
      .get('http://localhost:5125/Product/get-all-products', parameters)
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
  }

  getCategories(){
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

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }
}

