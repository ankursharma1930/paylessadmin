import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userData: any;

  constructor(private authService: AuthService){
    // this.authService.checkToken();
    // this.userData = localStorage.getItem('data');
    // this.userData = JSON.parse(this.userData); 
  }

  signout(){
    console.log("ASd");
    this.authService.signout();
  }
}
