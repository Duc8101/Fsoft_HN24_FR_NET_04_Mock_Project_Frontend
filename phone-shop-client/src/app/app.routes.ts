import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SearchComponent } from './components/search/search.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { CheckoutComponent } from './components/customer/checkout/checkout.component';
import { CustomerOrdersManagementComponent } from './components/customer/customer-orders-management/customer-orders-management.component';

export const routes : Routes = [
  {path : 'login', component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'forgot-password', component : ForgotPasswordComponent},
  {path : 'search', component : SearchComponent},
  {path : 'all-product', component : AllProductComponent},
  {path : 'product-detail/:id', component : ProductDetailComponent},
  {path : 'cart', component : CartComponent},
  {path : 'checkout', component : CheckoutComponent},
  {path : 'customer-orders-management', component : CustomerOrdersManagementComponent}, 
];
