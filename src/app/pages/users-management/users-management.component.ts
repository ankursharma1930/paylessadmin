import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subject, Subscription } from 'rxjs';


const GET_USERS = gql`
  query users {
    users {
    id
    name
    email
    role
    access
    status
  }
  }
`
const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
    id
    name
    email
    role
    access
    status
    
  }
  }
`


const UPDATE_USER = gql`
mutation updateUser($id: ID!, $name: String!, $role: String, $access: String, $password: String) {
  updateUser(id: $id, name: $name, role: $role, access: $access,  password:$password) {
    email
  }
}
`;

declare var window: any;

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  loading: boolean | undefined
  users: any

  email!: string;
  name!: string;
  password!: string;
  role!: string;
  access!: string;
  status!: string;
  newpassword!: string;

  userId: any;
  class!:string;
  message!:string;
  error: any;
  variable: any;
  private querySubscription: Subscription | undefined


  constructor(private apollo: Apollo) { }
  deleteModal: any;
  createModal: any;
  updateModal: any;
  idToDelete: number = 0;

  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    this.createModal = new window.bootstrap.Modal(
      document.getElementById('createModal')
    );

    this.updateModal = new window.bootstrap.Modal(
      document.getElementById('updateModal')
    );

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_USERS
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.users = data.users
        this.dtTrigger.next(null);
      })
  }

  openConfirmation(id: number) {
    this.idToDelete = id;
    this.deleteModal.show();
  }

  openCreateModal() {
    this.createModal.show();
  }

  openUpdateModal(id: number) {
    this.idToDelete = id;
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_USER,
        variables: {
          id: this.idToDelete
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.email = data.user.email
        this.name = data.user.name
        this.role = data.user.role
        this.access = data.user.access
        this.status = data.user.status
        this.userId = data.user.id
        console.log(data);
      })


    this.updateModal.show();
  }

  delete() {

    this.apollo
      .mutate({
        mutation: DELETE_USER,
        variables: {
          id: this.idToDelete
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('got data', data)
          this.deleteModal.hide();
          window.location.reload()
        },
        error => {
          console.log('there was an error sending the query', error)
        }
      )
  }


  onSubmit() {
    
    if (this.newpassword) {
      this.variable = {
        id: this.userId,
        name: this.name,
        role: String(this.role),
        access: String(this.access),
        status: String(this.status),
        password: this.newpassword
      };
    } else {
      this.variable = {
        id: this.userId,
        name: this.name,
        role: String(this.role),
        access: String(this.access),
        status: String(this.status),
        
      };
    }

    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: this.variable
      })
      .subscribe((result: any) => {

        if (result.data?.updateUser) {
          console.log("user updated");
          window.location.reload();
        }
      },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

}
