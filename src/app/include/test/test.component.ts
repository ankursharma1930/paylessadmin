import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular'

@Component({
  selector: 'app-test',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error :(</div>
    <div *ngIf="users">
      <div *ngFor="let user of users">
        <p>{{ user.name }}: {{ user.email }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  users: any[] | undefined
  loading = true
  error: any
 
  constructor(private apollo: Apollo) {}
 
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            users{
              name
              email
            }
          }
        `
      })
      .valueChanges.subscribe((result: any) => {
        this.users = result.data?.users
        this.loading = result.loading
        this.error = result.error
      })
  }
}
