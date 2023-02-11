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
export class AuthService {

  user: any[] | undefined;
  loading = true;
  error:any;

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private apollo: Apollo) {
    if (localStorage.getItem("token")) this.isAuthenticated.next(true);
    else this.isAuthenticated.next(false);
  }
  
  login(email: string, password: string, device: string) {
    
    this.apollo
      .mutate({
        mutation: login,
        variables: { email, password, device }
      })
      .subscribe((result: any) => {
        
        if(result.data?.login){
          localStorage.setItem("token", result.data?.login);
          this.isAuthenticated.next(true);
          this.getMe();
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
    window.location.href = "/login";
  }
  //Check user Token 
  checkToken(){
    if(!localStorage.getItem("token") || localStorage.getItem("token")== null){
      this.signout();
    }
  }

  getMe(){
    this.apollo
      .watchQuery({
        query: gql`
          {
            me{
              name
              email
              access
              role
            }
          }
        `
      })
      .valueChanges.subscribe((result: any) => {
        this.user = result.data?.me
        localStorage.setItem("data", JSON.stringify(this.user))
        this.loading = result.loading
        this.error = result.error
      })
  }

}
