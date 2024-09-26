import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../services/api/api.services';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ApiUrls } from '../../services/api/api-url';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toastService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule,
    ButtonModule,
    ImageModule,
    CarouselModule,
  TagModule,
RatingModule,
FormsModule,
TabMenuModule,
DataViewModule,
PaginatorModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  providers: [ToastService]
})
export class HomepageComponent implements OnInit {

  constructor(private apiService: ApiService,
    private dataService: DataService,
    private toastService: ToastService,
    private router: Router
  ){

  }
  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit() {
    this.getData();
    this.getCategories();
    this.getAllProduct();
  }
  products: any[] = []
  categories: any[] = []
  items: MenuItem[] | undefined;
  totalItem: number = 0;
  pageNum: number = 0;
  first: number = 0;
  allProducts: any;

  onCategorySelect(id : number){
    this.router.navigate(['/all-product'], { state: { categoryId: id } });
  }

  getData() {
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 16);
    parameters.set("currentPage", 1);

    this.apiService
      .get('http://localhost:5125/Product/get-top-products',  parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.products = response.data.list;
            console.log(this.products)
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
            this.items = this.categories.map(category => ({
              label: category.categoryName,
              command: () => this.onCategorySelect(category.categoryId)
            }));
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  getAllProduct() {
    let parameters: Map<string, any> = new Map();
    parameters.set("pageSize", 9);
    parameters.set("currentPage", this.pageNum + 1);
 
    this.apiService
      .post('http://localhost:5125/Product/get-all-products',[] ,parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.allProducts = response.data.list;
            this.totalItem = response.data.totalElement;
          } 
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 9;
    }
    this.getAllProduct();
  }

  addToCart(id: number) {
    let body = {
      productId: id
    }

    console.log(id)
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

  goProductDetail(productId: number){
    this.router.navigate(['/product-detail/', productId]);
  }
}
