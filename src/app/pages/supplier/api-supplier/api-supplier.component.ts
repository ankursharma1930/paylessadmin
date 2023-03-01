import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MessageService} from 'primeng/api';

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

  constructor(private http: HttpClient,private messageService: MessageService) { }

  ngOnInit(): void {
    this.openModal = new window.bootstrap.Modal(
      document.getElementById('openModal')
    );
  }

  onSubmit(){
    this.error = false;
    if(!this.id){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Supplier ID is missing!', sticky: true});
    }else{
      this.messageService.clear();
      this.getData(this.id);
    }
    // this.message = 
  }

  getData(id:any):any{
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, we are fetching the data..', sticky: true});
    this.waiting = true;
    this.message = "Please wait we are fetching the data...";
    this.getclass = "primary";
    //this.http.get('/api/suppliers/'+id, { headers })    //use apiurl later instead of /api/
    this.http.get(apiUrl+id, { headers })
    .subscribe(data => {
      this.alldata = data;
      //this.messageService.add({severity:'success', summary: 'Success', detail: 'Here is supplier details'});
      this.messageService.clear();
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
