import {AfterViewInit, Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy,ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import {Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Brands, AllPriceBreak, QuantitySlab, DELETE_CATEGORY_SUPPLIER, GET_CATEGORY_SUPPLIER, GET_CATEGORY_SUPPLIER_BYID, GET_CATEGORY, GET_FILTER_SUPPLIERS, CREATE_CATEGORY_SUPPLIER, UPDATE_CATEGORY_SUPPLIER } from './supplier-category-variables';


interface Leadtime {
  first?: string,
  second?: string,
  third?: string,
  forth?: string
}


declare var window: any;
@Component({
  selector: 'app-supplier-category',
  templateUrl: './supplier-category.component.html',
  styleUrls: ['./supplier-category.component.css']
})
export class SupplierCategoryComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  @Input() catId: any;
  supplierModal: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  catName: string = ''
  supplier: any
  supplierCompleteData: any;
  savedSuppliers: Array<String> = [];
  clickedSupplierId: string = ""
  lead_time: Leadtime = {};
  first_lead: string = ''
  sec_lead: string = ''
  third_lead: string = ''
  forth_lead: string = ''
  printA_Z: Array<string> = []
  default_mark_up: string = ''
  quantity_slab:  any[] = QuantitySlab
  all_price_break: any[] = AllPriceBreak
  min_qty:string=''
  web_qty: any[] = QuantitySlab
  brands:any[] = Brands
  

  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo, private messageService: MessageService, private fb: FormBuilder) { }
  ngOnInit(): void { 
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
   }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.savedSuppliers = [];
    this.supplier = [];
    if (changes['catId'] && !changes['catId'].firstChange) {
      this.supplierModal = new window.bootstrap.Modal(
        document.getElementById('supplierModal')
      );
      
      this.rerender()
      
      //Fetch category name
      this.apollo
        .watchQuery<any>({
          query: GET_CATEGORY,
          variables: {
            id: Number(this.catId)
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {

          this.catName = data.category.name;
        }
        )
      //Fetch category supplier 
      this.getSupplier();
    }
    this.printAZ();
  }

  //This function is for to fetch the all supplier inpopup

  fetchSupplier() {
    this.rerender()
    this.supplierCompleteData = [];
    this.messageService.add({ severity: 'info', detail: 'Please Wait, we are fetching suppliers!',sticky: true });
    this.apollo
      .watchQuery<any>({
        query: GET_CATEGORY_SUPPLIER,
        variables: {
          category_id: Number(this.catId)
        },
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (data.category_supplier.length) {
          this.supplier = data.category_supplier;
          for (var val of data.category_supplier) {
            this.savedSuppliers.push(val.supplier.id)
          }
        }

        if (this.savedSuppliers.length) {
          this.querySubscription = this.apollo
            .watchQuery<any>({
              query: GET_FILTER_SUPPLIERS,
              variables: {
                excludedIds: this.savedSuppliers
              },
              fetchPolicy: 'no-cache',
              errorPolicy: 'ignore'
            })
            .valueChanges.subscribe(({ data, loading }) => {
              this.supplierCompleteData = data.fsuppliers;
              this.rerender()
              this.messageService.clear();
            }, error => {
              this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Supplier data!' });
            })

        } else {
          this.querySubscription = this.apollo
            .watchQuery<any>({
              query: GET_FILTER_SUPPLIERS,
              variables: {
                excludedIds: []
              },
              fetchPolicy: 'no-cache',
              errorPolicy: 'ignore'
            })
            .valueChanges.subscribe(({ data, loading }) => {

              this.supplierCompleteData = data.fsuppliers;
              this.rerender()
              this.messageService.clear();
            }, error => {
              this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Supplier data!' });
            })
        }
        
        this.supplierModal.show();
      },
        error => {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Filter data!' });
        }
      )

  }

  //Here datatable got rerender, distroy the old one and create a new one
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
  //This function is to create a new supplier from tab

  addSupplier(event: any, id: any) {
    this.messageService.add({ severity: 'info', summary: 'Adding', detail: 'Its in-progress...' });
    this.apollo
      .mutate({
        mutation: CREATE_CATEGORY_SUPPLIER,
        variables: {
          supplier_id: id,
          category_id: this.catId,
          mark_up_by_quantity:JSON.stringify(QuantitySlab),
          supplier_price_break:JSON.stringify(AllPriceBreak),
          web_qty:JSON.stringify(QuantitySlab),
          brand:JSON.stringify(Brands)
        }
        
      })
      .subscribe((result: any) => {
        this.messageService.clear();
        if (result.data?.createCategorySupplier) {
          if(this.supplierCompleteData.length){
            let index = this.supplierCompleteData.findIndex((obj: { id: any; }) => obj.id === id);
            if(index !==-1){
              this.supplierCompleteData.splice(index,1);
              this.rerender();
            }
          }
          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: 'yahooo!', detail: 'Supplier Added' });
          this.getSupplier();
        }
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Somthing is wrong with supplier', sticky: true });
        }
      );
  }


  getSupplier() {
    this.apollo
      .watchQuery<any>({
        query: GET_CATEGORY_SUPPLIER,
        variables: {
          category_id: Number(this.catId)
        },
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (data.category_supplier.length) {
          this.supplier = data.category_supplier;
          for (var val of data.category_supplier) {
            this.savedSuppliers.push(val.supplier.id)
          }
        }else{
          this.supplier = null
        }
      },
        error => {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Supplier data!' });
        }
      )
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  onSubmit(f: NgForm) {
    this.lead_time = { first: this.first_lead, second: this.sec_lead, third: this.third_lead, forth: this.forth_lead }
    this.messageService.add({ severity: 'info', detail: 'Updating...' });
    this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY_SUPPLIER,
        variables: {
          id: this.clickedSupplierId,
          category_id: this.catId,
          lead_time: JSON.stringify(this.lead_time),
          default_mark_up: this.default_mark_up,
          mark_up_by_quantity:JSON.stringify(this.quantity_slab),
          supplier_price_break:JSON.stringify(this.all_price_break),
          min_qty:this.min_qty,
          web_qty:JSON.stringify(this.web_qty),
          brand:JSON.stringify(this.brands)
        }
      })
      .subscribe((result: any) => {

        if (result.data?.updateCategorySupplier) {
          this.messageService.clear();
          this.messageService.add({ severity: 'success', detail: 'Category Supplier Updated!' });
        }
      },
        error => {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', detail: 'Something is wrong, please refresh the page and try again' });
        }
      );

  }

  //Fetch category supplier using id, when select the particular supplier in accordin

  fetchCategorySupplierData(categorySupplierId: any) {
    this.clickedSupplierId = categorySupplierId;
    this.first_lead = this.sec_lead = this.third_lead = this.forth_lead = "";
    this.quantity_slab = QuantitySlab
    
    this.apollo
      .watchQuery<any>({
        query: GET_CATEGORY_SUPPLIER_BYID,
        variables: {
          id: categorySupplierId
        },
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (data.particular_category_supplier) {
          if (data.particular_category_supplier.lead_time) {
            this.lead_time = JSON.parse(data.particular_category_supplier.lead_time);
            this.first_lead = this.lead_time.first ? this.lead_time.first : ''
            this.sec_lead = this.lead_time.second ? this.lead_time.second : ''
            this.third_lead = this.lead_time.third ? this.lead_time.third : ''
            this.forth_lead = this.lead_time.forth ? this.lead_time.forth : ''
          }
          this.default_mark_up = data.particular_category_supplier.default_mark_up ? data.particular_category_supplier.default_mark_up : "";
          this.quantity_slab = data.particular_category_supplier.mark_up_by_quantity?JSON.parse(data.particular_category_supplier.mark_up_by_quantity):[]
          this.all_price_break = data.particular_category_supplier.supplier_price_break?JSON.parse(data.particular_category_supplier.supplier_price_break):[]
          this.min_qty = data.particular_category_supplier.min_qty?data.particular_category_supplier.min_qty:''
          this.web_qty = data.particular_category_supplier.web_qty?JSON.parse(data.particular_category_supplier.web_qty):[]
          this.brands = data.particular_category_supplier.brand?JSON.parse(data.particular_category_supplier.brand):[]
        }
      }
      )
  }

  removeSupplier(id:any){
    if(confirm("Are you sure?")) {
      this.apollo
      .mutate({
        mutation: DELETE_CATEGORY_SUPPLIER,
        variables: {
          id: id
        }
      })
      .subscribe(
        ({ data }) => {
          this.getSupplier();
          this.messageService.add({ severity: 'success', detail: 'Supplier deleted' });
        },
        error => {
          this.messageService.add({ severity: 'error', detail: 'Something is wrong!' });
        }
      )
    }
    
  }

  //type A-z 
  printAZ(): any {
    let i;
    for (i = 65; i <= 90; i++) {
      this.printA_Z.push(String.fromCharCode(i))
    }
  }

  //onCHange markup level
  onChangeMarkup(){
    this.quantity_slab.forEach(obj => {
        obj.realvalue = this.default_mark_up;
    });
    
  }

  //onkeyup slab
  onKeyUpSlab(i:any){
    
    this.quantity_slab.forEach(obj => {
      if(Number(obj.qty) >= Number(i.qty)){
        obj.realvalue = i.realvalue;
      }
  });
  }
}
