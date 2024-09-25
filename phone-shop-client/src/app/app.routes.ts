import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SearchComponent } from './components/search/search.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { AdminGuard } from './services/admin.guard';
import { CustomerGuard } from './services/customer.guard';
import { GuestGuard } from './services/guest.guard';
import { CustomerGuestGuard } from './services/customer-guest.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { CheckoutComponent } from './components/customer/checkout/checkout.component';
import { CustomerOrdersManagementComponent } from './components/customer/customer-orders-management/customer-orders-management.component';
import { SellerOrdersManagementComponent } from './components/admin/seller-orders-management/seller-orders-management.component';

export const routes : Routes = [
  {path : 'login', component : LoginComponent,canActivate: [GuestGuard]},
  {path : 'register', component : RegisterComponent,canActivate: [GuestGuard]},
  {path : 'forgot-password', component : ForgotPasswordComponent,canActivate: [GuestGuard]},
  {path : 'search', component : SearchComponent,canActivate: [CustomerGuestGuard]},
  {path : '', component : SearchComponent,canActivate: [CustomerGuestGuard]},
  {path : 'all-product', component : AllProductComponent,canActivate: [CustomerGuestGuard]},
  {path : 'product-detail/:id', component : ProductDetailComponent,canActivate: [CustomerGuestGuard]},
  {path : 'admin-page', component : AdminPageComponent,canActivate: [AdminGuard]},
  {path : 'user-profile', component : UserProfileComponent},
  {path : 'cart', component : CartComponent,canActivate: [CustomerGuard]},
  {path : 'checkout', component : CheckoutComponent,canActivate: [CustomerGuard]},
  {path : 'customer-orders-management', component : CustomerOrdersManagementComponent,canActivate: [CustomerGuard]}, 
  {path : 'seller-orders-management', component : SellerOrdersManagementComponent}, 
];
