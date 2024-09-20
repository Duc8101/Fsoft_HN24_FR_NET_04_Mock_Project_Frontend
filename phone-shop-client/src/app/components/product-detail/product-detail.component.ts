import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.services';
import { ApiUrls } from '../../services/api/api-url';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  error = "";
  productId!: number;
  product: Product = {
    productId: 0,
    categoryName: "string",
    productName: "",
    image: "",
    price: 0,
    categoryId: 0,
    quantity: 0,
    description: ""
  };
  constructor(private route: ActivatedRoute, private apiService: ApiService) {

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    });
    this.getData()
  }

  getData() {
    this.apiService
      .get(ApiUrls.URL_GET_PRODUCT_DETAIL + "/" + this.productId, null, null)
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

}
