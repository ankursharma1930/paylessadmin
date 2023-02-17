import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { ThisReceiver } from '@angular/compiler';


const UPSERT_SUPPLIER = gql`
mutation upsertSupplier($id: ID!, $name: String, $country: String, $currency: String, $postcode: String, $code:String) {
  upsertSupplier(id: $id, name: $name, country: $country, currency: $currency, postcode: $postcode, code:$code) {
    name
  }
}
`;


const apiUrl = "https://api.promodata.com.au/suppliers/";
const apitoken = "YjNiZTkxZWJkZDRkNWYzODo5MzkwMjg0M2Q3NjlkMWU3ZDI2MjdlMTkxMzk0YmQwNQ";
const headers = new HttpHeaders({
  'X-Auth-Token': apitoken,
  'Content-Type': 'application/json'
});

declare var window: any;

@Component({
  selector: 'app-api-all-supplier',
  templateUrl: './api-all-supplier.component.html',
  styleUrls: ['./api-all-supplier.component.css']
})
export class ApiAllSupplierComponent implements OnInit, OnDestroy {

  supplierModal: any;
  message: any;
  alldata: any;
  getclass: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  name!: string;
  code!: string;
  country!: string;
  currency!: string;
  postcode!: string;
  totalSupplier: number = 0;
  increment:number = 0;
  supplierId: any;
  
  error:any;
  complete: any;
  private querySubscription: Subscription | undefined

  constructor(private http: HttpClient, private apollo: Apollo) { }

  ngOnInit(): void {
    this.supplierModal = new window.bootstrap.Modal(
      document.getElementById('supplierModal')
    );
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 14
    };
  }

  fetchSupplier() {
    this.message = "Please wait we are fetching the data...";
    this.getclass = "primary";
    this.message = "Please wait we are fetching the data!";
    this.supplierModal.show();
    this.http.get('/api/suppliers/', { headers })    //use apiurl later instead of /api/
      .subscribe(apidata => {
        this.alldata = apidata;
        this.message = this.alldata.msg;
        this.getclass = "success";
        this.alldata = this.alldata.data
        this.dtTrigger.next(null);
      },
        error => {
          this.getclass = "danger";
          this.message = error.statusText;

        }
      );
  }

  addInSystem(getData:any):void{
    this.message = "Please wait we are sending data to your system...";
    this.getclass = "warning";
    this.totalSupplier = getData.length;
    getData.forEach( (value: any) => {  
      
      
      this.postcode = "NULL";
      if(value.details.addresses != undefined && value.details.addresses[0] != undefined){
        this.postcode = value.details.addresses[0].postcode;
      }
      
      this.apollo
      .mutate({
        mutation: UPSERT_SUPPLIER,
        variables: { 
          id:value.id,
          name:value.name,
          country:String(value.country),
          currency:"AUD",
          code:value.details.appa_identifier,
          postcode:this.postcode
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.upsertSupplier){
          console.log("Supplier updated"+ value.id);
          this.increment++;
          if(this.increment == this.totalSupplier){
            this.message = "All Suppliers got imported and updated into your system, you can close the popup";
            this.getclass = "success";
          }
        }
        
      },
        error => {
          this.message = "there was an error sending the query"+value.id;
          this.getclass = "danger";
        },
        
      );
      
    });  

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}


