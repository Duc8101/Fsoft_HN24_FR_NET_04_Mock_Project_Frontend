import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = sessionStorage.getItem('roleName'); 

    if (userRole === null) {
      return true; 
    }else if(userRole === 'Customer'){
      this.router.navigate(['/']);
    }else if(userRole === 'Admin'){
        this.router.navigate(['/admin-page']);
    }

    return false; 
  }
}
