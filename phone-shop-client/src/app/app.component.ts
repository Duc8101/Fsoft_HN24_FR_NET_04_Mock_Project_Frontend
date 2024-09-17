import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CustomerFooterComponent } from "./app-overlay/app-footer/customer-footer/customer-footer.component";
import { CustomerTopbarComponent } from "./app-overlay/app-topbar/customer-topbar/customer-topbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, CustomerFooterComponent, CustomerTopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'phone-shop-client';
}
