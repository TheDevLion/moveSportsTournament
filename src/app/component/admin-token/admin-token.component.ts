import { Component } from '@angular/core';
import { setAdminToken, isAdminMode, deleteAdminToken } from 'src/app/helpers/adminToken';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-token',
  templateUrl: './admin-token.component.html',
  styleUrls: ['./admin-token.component.css']
})
export class AdminTokenComponent {
  adminMode: boolean = false;

  constructor(private router: Router) {
    if (!isAdminMode())
    {
      setAdminToken();      
      this.adminMode = true;
    }
    else {
      deleteAdminToken();      
      this.adminMode = false;
    }
  }

  navigateBack(){
    this.router.navigateByUrl('');
  }
}


// FAZER UM ACESSO COM SENHA PARA O ADMIN