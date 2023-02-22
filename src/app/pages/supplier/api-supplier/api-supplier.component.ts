import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const apiUrl = "https://api.promodata.com.au/suppliers/";
const apitoken = "YjNiZTkxZWJkZDRkNWYzODo5MzkwMjg0M2Q3NjlkMWU3ZDI2MjdlMTkxMzk0YmQwNQ";
const headers = new HttpHeaders({
  'X-Auth-Token': apitoken,
  'Content-Type' : 'application/json'
});

declare var window:any;


@Component({
  selector: 'app-api-supplier',
  templateUrl: './api-supplier.component.html',
  styleUrls: ['./api-supplier.component.css']
})

export class ApiSupplierComponent implements OnInit {

  id!:string;
  message!:string;
  error:boolean = false;
  alldata:any;
  waiting:boolean = false;
  openModal:any;
  getclass!:string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.openModal = new window.bootstrap.Modal(
      document.getElementById('openModal')
    );
  }

  onSubmit(){
    this.error = false;
    if(!this.id){
      this.error = true;
      this.getclass = "danger";
      this.message = "Supplier ID is missing!"
    }else{
      this.getData(this.id);
      
    }
    // this.message = 
  }

  getData(id:any):any{
    this.waiting = true;
    this.message = "Please wait we are fetching the data...";
    this.getclass = "primary";
    //this.http.get('/api/suppliers/'+id, { headers })    //use apiurl later instead of /api/
    this.http.get(apiUrl+id, { headers })
    .subscribe(data => {
      this.alldata = data;
      this.message = this.alldata.msg;
      this.getclass = "success";
      this.openModal.show();
    }
    ,
    error => {
          this.error = true;
          this.waiting = false;
          this.getclass = "danger";
          this.message = error.statusText;
          console.log('there was an error sending the query', error)
        }
    );
  }

}
