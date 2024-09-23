import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../../../services/api/api.services';
import { ApiUrls } from '../../../services/api/api-url';
import { Category } from '../../../models/category';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    PaginatorModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit {
  error = '';

  categorytDialog: boolean = false;

  deleteCategoryDialog: boolean = false;

  deleteCategoriesDialog: boolean = false;

  categories: Category[] = [];

  isUpdate: boolean = false;

  category: Category = {
    categoryId : 0,
    categoryName : ""
  }

  selectedCategories: Category[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  pageNum: number = 0;

  first: number = 0;

  totalItem: number = 0;

  name: string = "";

  constructor(private readonly apiService: ApiService,private messageService: MessageService) { }

  onPageChange(event: PaginatorState) {
    if (event.page || event.page === 0) {
      this.pageNum = event.page;
      this.first = (this.pageNum) * 9;
    }
    this.getListCategory();
  }


  ngOnInit() {
    this.getListCategory();
  }

  openNew() {
    this.category = {
        categoryId : 0,
        categoryName : ""
    };
    this.submitted = false;
    this.categorytDialog = true;
    this.isUpdate = false;
  }

  openUpdateCategory(categoryUpdate: Category) {
      this.categorytDialog = true;
      this.isUpdate = true; 
      this.category.categoryId = categoryUpdate.categoryId;
      this.category.categoryName = categoryUpdate.categoryName;
  }

  openDeleteCategory(categoryDelete: Category){
    this.deleteCategoryDialog = true;
    this.category.categoryId = categoryDelete.categoryId;
    this.category.categoryName = categoryDelete.categoryName;
  }


  confirmDeleteSelected() {
      this.deleteCategoriesDialog = false;
  }

  hideDialog() {
      this.categorytDialog = false;
      this.submitted = false;
  }

  showSuccess(action: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: action + ' Successful' });
  }

  showError(action: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: action + ' Failed' });
  }
  
  getListCategory(){
    let parameters: Map<string, any> = new Map();
    parameters.set("name", this.name);
    parameters.set("pageSize", 10);
    parameters.set("currentPage", this.pageNum + 1);

    this.apiService
      .get(ApiUrls.URL_GET_CATEGORY_GET_CATEGORIES_PAGINATION,parameters)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.categories = response.data.list;
            this.totalItem = response.data.totalElement;
          } else {
            this.error = message;
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  };

  createCategory(){
    this.submitted = true;
    this.apiService
      .post(ApiUrls.URL_CREATE_CATEGORY,this.category,null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListCategory();
            this.showSuccess("Add Category");
          } else {
            this.error = message;
            this.showError("Add Category");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
      this.categories = [...this.categories];
          this.categorytDialog = false;
          this.category = {
            categoryId : 0,
            categoryName : ""
          };
  }

  updateCategory(){
    this.submitted = true;
    console.log(this.category)
    this.apiService
      .put(ApiUrls.URL_UPDATE_CATEGORY+"/"+this.category.categoryId,this.category)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getListCategory();
            this.showSuccess("Update Category");
          } else {
            this.error = message;
            this.showError("Update Category");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
      this.categories = [...this.categories];
          this.categorytDialog = false;
          this.category = {
            categoryId : 0,
            categoryName : ""
          };
    
  };

  deleteCategory(id: number){
    this.apiService
      .delete(ApiUrls.URL_DELETE_CATEGORY+"/"+id,null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          console.log(message);
          if (code === 200) {
            this.getListCategory();
            this.showSuccess("Delete Category");
          } else {
            this.error = message;
            this.showError("Delete Category");
          }
        },
        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
      this.deleteCategoryDialog = false;
  }


  onGlobalFilter(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
    this.getListCategory();
  }

}
