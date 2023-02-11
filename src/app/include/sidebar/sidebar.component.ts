import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole:number = 0; //0 for no role assign
  userData:any | string | null;
  user: any[] | undefined;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    if(localStorage.getItem('data')){
      this.userData = localStorage.getItem('data');
      this.userData = JSON.parse(this.userData); 
      this.userRole = this.userData.role;
    }else{
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
        this.userRole = result.data?.me.role
      })
    }
    
    
  }
}
