import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SearchComponent } from './components/search/search.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ManageProductComponent } from './components/admin/manage-product/manage-product.component';
import { ManageCategoryComponent } from './components/admin/manage-category/manage-category.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';

export const routes : Routes = [
  {path : 'login', component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'forgot-password', component : ForgotPasswordComponent},
  {path : 'search', component : SearchComponent},
  {path : 'all-product', component : AllProductComponent},
  {path : 'product-detail/:id', component : ProductDetailComponent},
  {path : 'manage-product', component : ManageProductComponent},
  {path : 'manage-category', component : ManageCategoryComponent},
  {path : 'admin-page', component : AdminPageComponent},
];
