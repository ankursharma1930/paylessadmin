import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subject, Subscription } from 'rxjs';



const GET_SUPPLIERS = gql`
  query suppliers {
    suppliers {
    id
    name
    code
    country
    currency
    postcode
  }
  }
`

const GET_SUPPLIER = gql`
  query user($id: ID!) {
    supplier(id: $id) {
    id
    name
    code
    country
    currency
    postcode
  }
  }
`

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  loading: boolean | undefined
  suppliers: any
  
  
  name!: string;
  code!: string;
  country!: string;
  currency!: string;
  postcode!: string;

  supplierId: any;
  
  error:any;

  private querySubscription: Subscription | undefined
 

  constructor(private apollo: Apollo) { }
  deleteModal:any;
  createModal:any;
  updateModal:any;
  idToDelete:number = 0;

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_SUPPLIERS
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.suppliers = data.suppliers
        this.dtTrigger.next(null);
      })

  }

}
