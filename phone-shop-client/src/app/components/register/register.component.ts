import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error = '';
  formRegister: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly apiService: ApiService, private readonly router: Router) {
    this.formRegister = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
      password: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
    });
  }
  private noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  submit(){

  }
}
