import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-footer',
  standalone: true,
  imports: [],
  templateUrl: './customer-footer.component.html',
  styleUrl: './customer-footer.component.scss'
})
export class CustomerFooterComponent {
  phone: string = '0966390661'
  mail: string = 'phoneshop@gmail.com'
  address: string = 'Twitter beans, FPT Hà Nội'
  currentYear: number = new Date().getFullYear();
  noCopyright: string;

  constructor() {
    this.noCopyright = '© ' + this.currentYear + ' - ' + 'Bản quyền thuộc về anh em Nhóm 3'
  }
}
