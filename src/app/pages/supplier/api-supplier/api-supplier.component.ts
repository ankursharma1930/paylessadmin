import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const apiUrl = "https://api.promodata.com.au/suppliers/";
const apitoken = "YjNiZTkxZWJkZDRkNWYzODo5MzkwMjg0M2Q3NjlkMWU3ZDI2MjdlMTkxMzk0YmQwNQ";
const headers = new HttpHeaders({
  'X-Auth-Token': apitoken,
  'Content-Type' : 'application/json'
});

@Component({
  selector: 'app-api-supplier',
  templateUrl: './api-supplier.component.html',
  styleUrls: ['./api-supplier.component.css']
})

export class ApiSupplierComponent implements OnInit {

  id!:string;
  message!:string;
  error:boolean = false;
  data:any;
  waiting:boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.error = false;
    if(!this.id){
      this.error = true;
      this.message = "Supplier ID is missing!"
    }else{
      this.getData(this.id);
      
    }
    // this.message = 
  }

  getData(id:any):any{
    this.waiting = true;
    this.message = "Please wait we are fetching the data...";
    // this.http.get('/api/suppliers/'+id, { headers })    //use apiurl later instead of /api/
    // .subscribe(data => {
    //   this.data = data;
    //   this.message = this.data.msg;
    // }
    // ,
    // error => {
    //       this.error = true;
    //       this.waiting = false;
    //       this.message = error.statusText;
    //       console.log('there was an error sending the query', error)
    //     }
    // );
  }

}
