import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql} from 'apollo-angular';

const CREATE_SUPPLIER = gql`
mutation createSupplier($name: String, $code: String, $country: String, $currency: String, $postcode: String) {
  createSupplier(name: $name, code: $code, country: $country, currency: $currency, postcode: $postcode) {
    name
  }
}
`;

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.css']
})
export class SupplierCreateComponent implements OnInit {

  name!: string;
  code!: string;
  country!: string;
  currency!: string;
  postcode!: string;
  
  loading = true;
  error:any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
  }
  onSubmit(){
    this.apollo
      .mutate({
        mutation: CREATE_SUPPLIER,
        variables: { 
          name:this.name,
          code:this.code,
          country:this.country,
          currency:this.currency,
          postcode:this.postcode,
          
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.createSupplier){
          console.log("Supplier created");
          window.location.reload();
        }
      },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

}
