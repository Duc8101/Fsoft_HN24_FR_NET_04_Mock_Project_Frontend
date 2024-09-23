import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = sessionStorage.getItem('roleName'); 

    if (userRole === null || userRole === 'Customer') {
      return true; 
    }else if(userRole === 'Admin'){
        this.router.navigate(['/admin-page']);
    }

    return false; 
  }
}
