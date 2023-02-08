import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole:number = 0; //0 for no role assign
  userData:any | string | null;

  ngOnInit() {
    if(localStorage.getItem('data')){
      this.userData = localStorage.getItem('data');
      this.userData = JSON.parse(this.userData); 
      this.userRole = this.userData.role;
    }
    
    
  }
}
