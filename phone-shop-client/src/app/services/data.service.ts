import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
    private objectSource  = new BehaviorSubject<any>({});
    currentObject = this.objectSource.asObservable();
    private test :number = 0;
    private searchName :string = "";
    private callFunctionSource = new Subject<void>();
    callFunction$ = this.callFunctionSource.asObservable();
    constructor() {}

    triggerFunctionCall() {
        this.callFunctionSource.next();
    }

    setCartLength(cartLength: number){
        this.test = cartLength;
    }

    getCartLength(){
        return this.test;
    }

    getLoginStatus(){
        return sessionStorage.getItem('username') ? true : false;
    }

    setSearchName(name: string){
        this.searchName = name;
    }

    getSearchName(){
        return this.searchName;
    }
    
}
