import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  catId:string = ''

  constructor() { }

  ngOnInit(): void {
  }
  getCatId(catId:string){
    this.catId = catId
    console.log("this is in parent"+ this.catId);
  }
}
