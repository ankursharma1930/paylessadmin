import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql} from 'apollo-angular';

const login = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) 
}
`;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private apollo: Apollo) {
    if (localStorage.getItem("token")) this.isAuthenticated.next(true);
    else this.isAuthenticated.next(false);
  }
  
  login(email: string, password: string) {
    
    this.apollo
      .mutate({
        mutation: login,
        variables: { email, password }
      })
      .subscribe((result: any) => {
        //console.log(result.data?.login);
        if(result.data?.login){
          localStorage.setItem("token", result.data?.login);
          this.isAuthenticated.next(true);
          window.location.href = "/dashboard";
        }
      },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }
  //Logout user
  signout() {
    localStorage.removeItem("token");
    this.isAuthenticated.next(false);
    window.location.href = "/";
  }
  //Check user Token 
  checkToken(){
    if(!localStorage.getItem("token") || localStorage.getItem("token")== null){
      this.signout();
    }
  }
}
