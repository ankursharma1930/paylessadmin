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
`;

const DELETE_SUPPLIER = gql`
  mutation deleteSupplier($id: ID!) {
    deleteSupplier(id: $id) {
      id
    }
  }
`;

const GET_SUPPLIER = gql`
  query supplier($id: ID!) {
    supplier(id: $id) {
    id
    name
    code
    country
    currency
    postcode
  }
  }
`;

const UPDATE_SUPPLIER = gql`
mutation updateSupplier($id: ID!, $name: String, $country: String, $currency: String, $postcode: String) {
  updateSupplier(id: $id, name: $name, country: $country, currency: $currency, postcode: $postcode) {
    name
  }
}
`;

declare var window:any;

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
  updateModal:any;
  idToDelete:number = 0;

  ngOnInit(): void {

    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
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
        query: GET_SUPPLIERS
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.suppliers = data.suppliers
        this.dtTrigger.next(null);
      })

  }

  openConfirmation(id:number){
    this.idToDelete = id;
    this.deleteModal.show();
  }
  

  openUpdateModal(id:number){
    this.idToDelete = id;
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_SUPPLIER,
        variables: {
          id: this.idToDelete
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.name = data.supplier.name
        this.country = data.supplier.country
        this.currency = data.supplier.currency
        this.postcode = data.supplier.postcode
        this.supplierId = data.supplier.id
        console.log(data);
      })


    this.updateModal.show();
  }

  delete(){
    
    this.apollo
      .mutate({
        mutation: DELETE_SUPPLIER,
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

  onSubmit(){
   console.log(typeof this.supplierId)
    this.apollo
      .mutate({
        mutation: UPDATE_SUPPLIER,
        variables: { 
          id:this.supplierId,
          name:this.name,
          country:String(this.country),
          currency:String(this.currency),
          postcode:String(this.postcode)
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.updateSupplier){
          console.log("Supplier updated");
          window.location.reload();
        }
      },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

}
