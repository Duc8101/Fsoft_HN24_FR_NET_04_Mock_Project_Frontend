import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../models/cart';
import { ApiService } from './api/api.services';
import { ApiUrls } from './api/api-url';


@Injectable({
  providedIn: 'root',
})
export class DataService{
    error = "";
    private objectSource  = new BehaviorSubject<any>({});
    currentObject = this.objectSource.asObservable();
    private test :number = 0;
    private searchName :string = "";
    private callFunctionSource = new Subject<void>();
    callFunction$ = this.callFunctionSource.asObservable();
    private carts: CartItem[] = [];
    

    constructor(private readonly apiService: ApiService) {}

    triggerFunctionCall() {
        this.callFunctionSource.next();
    }

    setListCart(){
        this.apiService
        .get(ApiUrls.URL_GET_CART, null)
        .subscribe(
          (response) => {
            const code = response.code;
            const message = response.message;
            if (code === 200) {
              this.carts = response.data.cartDetailDTOs;
            } else {
              this.error = message;
            }
          },
        );
    }

    getListCart() : any[]{
        return this.carts;
    }


    setSearchName(name: string){
        this.searchName = name;
    }

    getSearchName(){
        return this.searchName;
    }
    
}
