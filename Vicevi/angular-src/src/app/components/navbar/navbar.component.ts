import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AlertService } from "ngx-alerts";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private router:Router,
    private Alert:AlertService
  ) { }

  ngOnInit() {
  }
  onLogoutClick(){
     this.authService.logout();
     this.Alert.success("You are now logged out");
     this.router.navigate(['/login']);
     return false;
  }
  isLoggedIn(){
    return this.authService.isLogged();
  }
}
