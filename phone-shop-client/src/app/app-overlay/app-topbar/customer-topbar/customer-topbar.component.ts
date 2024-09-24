import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../layout-service/app.layout.service';
import { DataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.services';
import { ApiUrls } from '../../../services/api/api-url';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-customer-topbar',
  standalone: true,
  imports: [CommonModule, StyleClassModule, DividerModule, ChartModule, ButtonModule, PanelModule, FormsModule,MenuModule],
  templateUrl: './customer-topbar.component.html',
  styleUrl: './customer-topbar.component.scss'
})
export class CustomerTopbarComponent implements OnInit {
  searchName: string = "";
  items: MenuItem[] | undefined;

  constructor(public layoutService: LayoutService, public router: Router,
    public readonly dataService: DataService, private readonly apiService: ApiService) { }
  ngOnInit(): void {
    this.items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'User-Profile',
                    icon: 'pi pi-user-edit'
                },
                {
                    label: 'Management Order',
                    icon: 'pi pi-cart-arrow-down'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out'
                }
            ]
        }
    ];
  }

  searchProduct() {
    this.dataService.setSearchName(this.searchName);
    this.dataService.triggerFunctionCall();
    this.router.navigate(['/search']);
  }

  login() {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token === null) {
      this.router.navigate(['/login']);
    } else {
      const parameters: Map<string, any> = new Map();
      parameters.set('token', token);
      this.apiService.get(ApiUrls.URL_GET_USER_BY_TOKEN, parameters).subscribe(
        (response) => {
          const code = response.code;
          console.log(code)
          if (code === 200) {
            console.log(`token : ${token}`);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('roleId', response.data.roleId);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('roleName', response.data.roleName);
            if (response.data.roleId == 1) {
              this.router.navigate(['/admin-page']);
            } else {
              this.router.navigate(['']);
            }
          } else {
            alert(`${response.message}`);
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },

        (error) => {
          if (error.status === 401) {
            alert('Unauthorized');
          } else {
            console.error('Có lỗi xảy ra : ', error);
          }
        }
      );
    }
  }
}
