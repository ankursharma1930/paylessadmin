import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-testauth',
  templateUrl: './testauth.component.html',
  styleUrls: ['./testauth.component.css']
})
export class TestauthComponent implements OnInit {

  constructor(private authService: AuthService){
    //this.authService.getMe();
  }

  ngOnInit(): void {
  }

}
