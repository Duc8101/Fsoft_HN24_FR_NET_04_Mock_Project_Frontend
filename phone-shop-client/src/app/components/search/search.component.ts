import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../models/product';
import { SelectItem } from 'primeng/api';
import { ApiService } from '../../services/api/api.services';
import { ActivatedRoute, Router } from '@angular/router';
import { DataView } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DataService } from '../../services/data.service';
import { ApiUrls } from '../../services/api/api-url';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    DropdownModule,
    RatingModule,
    ButtonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

export class SearchComponent implements OnInit {
  error = '';

  products: Product[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  sourceCities: any[] = [];

  targetCities: any[] = [];

  orderCities: any[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router,
    private readonly dataService: DataService,

  ) { }

  ngOnInit() {
    this.getData();
    this.dataService.callFunction$.subscribe(() => {
      this.getData();
    });
    this.sourceCities = [
      { name: 'San Francisco', code: 'SF' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Berlin', code: 'BRL' },
      { name: 'Barcelona', code: 'BRC' },
      { name: 'Rome', code: 'RM' },
    ];

    this.targetCities = [];

    this.orderCities = [
      { name: 'San Francisco', code: 'SF' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Berlin', code: 'BRL' },
      { name: 'Barcelona', code: 'BRC' },
      { name: 'Rome', code: 'RM' },
    ];

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }

  getData() {
    let parameters: Map<string, any> = new Map();
    parameters.set("name", this.dataService.getSearchName());
    parameters.set("pageSize", 10);
    parameters.set("currentPage", 1);

    this.apiService
      .get(ApiUrls.URL_GET_ALL_PRODUCTS, parameters, null)
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
    this.dataService.setSearchName("");
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
