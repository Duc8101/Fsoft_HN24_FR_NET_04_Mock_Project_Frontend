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
import { TagModule } from 'primeng/tag';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastService } from '../../services/toastService';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    DropdownModule,
    RatingModule,
    ButtonModule,
    TagModule,
    PaginatorModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [ToastService]
})

export class SearchComponent implements OnInit {
  error = '';

  products: Product[] = [];

  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;

  constructor(
    private readonly apiService: ApiService,
    private readonly routers: Router,
    private readonly dataService: DataService,
private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getData();
    this.dataService.callFunction$.subscribe(() => {
      this.getData();
    });
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
          this.toastService.showSuccess("Add to cart success!")
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
    parameters.set("name", this.dataService.getSearchName());
    parameters.set("pageSize", 9);
    parameters.set("currentPage", this.pageNum + 1);

    this.apiService
      .post(ApiUrls.URL_GET_ALL_PRODUCTS,[], parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.products = response.data.list;
            this.totalItem =  response.data.totalElement;
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

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 9;
    }
    this.getData();
  }

  goProductDetail(productId: number){
    this.routers.navigate(['/product-detail/', productId]);
  }
}
