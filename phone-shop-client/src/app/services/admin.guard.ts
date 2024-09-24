import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = sessionStorage.getItem('roleName'); 

    if (userRole === 'Admin') {
      return true; 
    }else{
      this.router.navigate(['/']);
    }

    return false; 
  }
}
