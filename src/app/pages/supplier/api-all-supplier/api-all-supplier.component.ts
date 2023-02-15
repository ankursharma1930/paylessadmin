import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.supplierModal = new window.bootstrap.Modal(
      document.getElementById('supplierModal')
    );
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}


