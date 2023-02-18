import { Component } from '@angular/core';


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
  
  constructor(private apollo: Apollo){
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    if (localStorage.getItem("token")) this.isAuthenticated.next(true);
    else this.isAuthenticated.next(false);
  }

  onSubmit():any{
    
    if(!this.email || !this.password){
      this.class = "danger";
      this.message = "Required fields are missing!";
      return false;
    }

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
          localStorage.setItem("token", result.data?.login);
          this.isAuthenticated.next(true);
          //this.getMe();
          window.location.href = "/dashboard";
        }
      },
        error => {
          this.class = "danger";
          this.message = "Please cross check your credentials!";
          return false;
          //console.log("there was an error sending the query", error);
        }
      );
  
  }
}
