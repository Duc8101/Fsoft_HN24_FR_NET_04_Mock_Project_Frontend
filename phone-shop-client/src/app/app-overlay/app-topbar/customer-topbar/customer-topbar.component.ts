import { Component } from '@angular/core';
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

@Component({
  selector: 'app-customer-topbar',
  standalone: true,
  imports: [CommonModule, StyleClassModule, DividerModule, ChartModule, ButtonModule, PanelModule,FormsModule],
  templateUrl: './customer-topbar.component.html',
  styleUrl: './customer-topbar.component.scss'
})
export class CustomerTopbarComponent {
  searchName: string = "";
  
  constructor(public layoutService: LayoutService, public router: Router,
    public readonly dataService: DataService,private readonly apiService: ApiService) { }

  searchProduct(){
    this.dataService.setSearchName(this.searchName);
    this.dataService.triggerFunctionCall();
    this.router.navigate(['/search']); 
  }
}
