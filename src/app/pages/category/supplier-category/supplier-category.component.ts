import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { first, Subject, Subscription } from 'rxjs';
import { QuantitySlab, DELETE_CATEGORY_SUPPLIER, GET_CATEGORY_SUPPLIER, GET_CATEGORY_SUPPLIER_BYID, GET_CATEGORY, GET_FILTER_SUPPLIERS, CREATE_CATEGORY_SUPPLIER, UPDATE_CATEGORY_SUPPLIER } from './supplier-category-variables';


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
export class SupplierCategoryComponent implements OnChanges, OnDestroy {
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
  //mark_up_by_quantity: string[] = [];
  quantity_slab: readonly any[] = QuantitySlab
  

  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo, private messageService: MessageService, private fb: FormBuilder) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.savedSuppliers = [];
    this.supplier = [];
    if (changes['catId'] && !changes['catId'].firstChange) {
      this.supplierModal = new window.bootstrap.Modal(
        document.getElementById('supplierModal')
      );

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10
      };
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
              this.dtTrigger.next(null);
            }, error => {
              this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Supplier data!' });
            })

        } else {
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
              this.dtTrigger.next(null);
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

  //This function is to create a new supplier from tab

  addSupplier(event: any, id: any) {
    this.apollo
      .mutate({
        mutation: CREATE_CATEGORY_SUPPLIER,
        variables: {
          supplier_id: id,
          category_id: this.catId,
          mark_up_by_quantity:JSON.stringify(QuantitySlab)
        }
        
      })
      .subscribe((result: any) => {
        this.messageService.clear();
        if (result.data?.createCategorySupplier) {
          this.messageService.add({ severity: 'success', summary: 'yahooo!', detail: 'Supplier Added' });

          this.getSupplier();
          console.log(QuantitySlab);
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
          this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Filter data!' });
        }
      )
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  onSubmit(f: NgForm) {
    // console.log(typeof JSON.stringify(this.quantity_slab));
    this.lead_time = { first: this.first_lead, second: this.sec_lead, third: this.third_lead, forth: this.forth_lead }
    
    
    this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY_SUPPLIER,
        variables: {
          id: this.clickedSupplierId,
          category_id: this.catId,
          lead_time: JSON.stringify(this.lead_time),
          default_mark_up: this.default_mark_up,
          mark_up_by_quantity:JSON.stringify(this.quantity_slab)
        }
      })
      .subscribe((result: any) => {

        if (result.data?.updateCategorySupplier) {
          this.messageService.clear();
          this.messageService.add({ severity: 'success', detail: 'Category Supplier Updated!' });
          QuantitySlab.forEach(obj => delete obj.realvalue);
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
    console.log(QuantitySlab)
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
    
  }
}
