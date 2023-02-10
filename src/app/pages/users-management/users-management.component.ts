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

declare var window:any;

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
  
  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo) { }
  deleteModal:any;
  idToDelete:number = 0;

  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
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

  openConfirmation(id:number){
      this.idToDelete = id;
      console.log(id);
      this.deleteModal.show();
  }

  delete(){
    console.log(this.idToDelete);
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
        },
        error => {
          console.log('there was an error sending the query', error)
        }
      )
  }

}
