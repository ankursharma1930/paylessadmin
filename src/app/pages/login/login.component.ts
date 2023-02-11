import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email!: string;
  password!: string;
  device: string = "web";

  constructor(private authService: AuthService){
    localStorage.removeItem("token");
    localStorage.removeItem("data");
  }

  onSubmit(){
    this.authService.login(this.email, this.password, this.device);
  }
}
