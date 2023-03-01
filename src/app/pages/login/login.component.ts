import { Component } from '@angular/core';

import {MessageService} from 'primeng/api';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql} from 'apollo-angular';


const login = gql`
mutation login($email: String!, $password: String!, $device: String!) {
  login(email: $email, password: $password, device: $device) 
}
`;

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email!: string;
  password!: string;
  device: string = "web";
  class!: string;
  message!: string;
  data:any;

  user: any[] | undefined;
  loading = true;
  error:any;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private apollo: Apollo,private messageService: MessageService){
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    if (localStorage.getItem("token")) this.isAuthenticated.next(true);
    else this.isAuthenticated.next(false);
  }

  onSubmit():any{
    
    if(!this.email || !this.password){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Require Field is missing!'});
      return false;
    }
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, we are checking..', sticky: true});
    this.apollo
      .mutate({
        mutation: login,
        variables: { 
          email:this.email,
          password:this.password,
          device:this.device
         }
      })
      .subscribe((result: any) => {
        
        if(result.data?.login){
          this.messageService.add({severity:'success', summary: 'Welcome', detail: 'Welcom to the panel!'});
          localStorage.setItem("token", result.data?.login);
          this.isAuthenticated.next(true);
          window.location.href = "/dashboard";
        }
      },
        error => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Something is wrong, please cross check your detail.'});
          return false;
    
        }
      );
  
  }
}
