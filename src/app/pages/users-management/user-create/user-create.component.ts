import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql} from 'apollo-angular';


const CREATE_USER = gql`
mutation createUser($email: String!, $password: String!, $name: String!, $role: String!, $access: String!) {
  createUser(email: $email, password: $password, name: $name, role: $role, access: $access) {
    email
  }
}
`;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  email!: string;
  name!: string;
  password!: string;
  role!: string;
  access!: string;
  status!: string;
  loading = true;
  error:any;


  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.apollo
      .mutate({
        mutation: CREATE_USER,
        variables: { 
          email:this.email,
          password:this.password,
          name:this.name,
          role:this.role,
          access:this.access,
          status:this.status
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.createUser){
          console.log("user created");
          window.location.reload();
        }
      },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

}
