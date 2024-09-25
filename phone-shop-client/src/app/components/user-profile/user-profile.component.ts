import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api/api.services';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiUrls } from '../../services/api/api-url';
import { FormsModule } from '@angular/forms'; 
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  error = "";
  formUpdate: FormGroup;
  formChangePassword: FormGroup;
  user: User = {
    fullName : "",
    phone : "",
    email: "",
    address: "",
    username: "",
  }

  userUpdate: User = {
    fullName : "",
    phone : "",
    email: "",
    address: "",
    username: "",
  }

  dialogChangePassword = false;
  dialogUpdate = false;

  constructor(private readonly apiService: ApiService,private messageService: MessageService) { 
    this.formUpdate = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      phone: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
      username: new FormControl(''),
    });
    this.formChangePassword = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.getUserProfile();
    console.log(localStorage.getItem('token'));
    
  }

  showSuccess(action: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: action + ' Successful' });
  }

  showError(action: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: action + ' Failed: '+ this.error});
  }

  openChangePassword(){
    this.dialogChangePassword = true;
  }

  changePassword(){
    let changePassword = {
      currentPassword: this.formChangePassword.value.currentPassword,
      newPassword: this.formChangePassword.value.newPassword,
      confirmPassword: this.formChangePassword.value.confirmPassword
    };
    this.apiService
    .put(ApiUrls.URL_CHANGE_PASSWORD, changePassword)
    .subscribe(
      (response) => {
        const code = response.code;
        const message = response.message;
        console.log(response)

        if (code === 200) {
          this.getUserProfile();
          this.showSuccess("Change Password");
          this.dialogChangePassword = false;
        } else {
          this.error = message;
          this.showError("Change Password");
        }
      },

      (error) => {
        console.error('Có lỗi xảy ra : ', error);
      }
    );
  }

  openUpdateUser(){
    this.dialogUpdate = true;
    this.userUpdate = {
      fullName : this.user.fullName,
      phone : this.user.phone,
      email: this.user.email,
      address: this.user.address,
      username: "",
    }
  }

  updateUser(){
    this.apiService
      .put(ApiUrls.URL_UPDATE_USER, this.userUpdate)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.getUserProfile();
          } else {
            this.error = message;
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
    this.dialogUpdate = false;
  }

  hideDialog() {
    this.dialogUpdate = false;
    this.dialogChangePassword = false;
}

  getUserProfile() {
    this.apiService
      .get(ApiUrls.URL_GET_USER_DETAIL, null)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.user = response.data;
          } else {
            this.error = message;
          }
        },

        (error) => {
          console.error('Có lỗi xảy ra : ', error);
        }
      );
  }
}
