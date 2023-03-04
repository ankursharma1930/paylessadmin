import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-supplier-category',
  templateUrl: './supplier-category.component.html',
  styleUrls: ['./supplier-category.component.css']
})
export class SupplierCategoryComponent implements OnChanges {
  @Input() catId:any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
