import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';


const GET_USERS = gql`
  query GetPosts {
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

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  loading: boolean | undefined
  users: any
  
  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo) { }
  

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_USERS
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.users = data.users
      })
  }

  

}
