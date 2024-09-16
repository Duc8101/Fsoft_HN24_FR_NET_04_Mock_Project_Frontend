import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-customer-topbar',
  standalone: true,
  imports: [CommonModule, StyleClassModule, DividerModule, ChartModule, ButtonModule, PanelModule],
  templateUrl: './customer-topbar.component.html',
  styleUrl: './customer-topbar.component.scss'
})
export class CustomerTopbarComponent {
  constructor(public router: Router) { }
}
