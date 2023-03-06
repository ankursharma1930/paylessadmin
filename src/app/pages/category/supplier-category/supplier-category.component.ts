import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {MessageService} from 'primeng/api';
import { Subject, Subscription } from 'rxjs';


const GET_CATEGORY_SUPPLIER = gql`
  query category_supplier($category_id: Int!){
    category_supplier(category_id: $category_id){
      id
      category_id
      supplier{
        id
        name
      }
    }
  }
`

const GET_CATEGORY = gql`
  query category($id: ID!){
    category(id: $id){
      name
    }
  }
`

const GET_SUPPLIERS = gql`
  query suppliers {
    suppliers {
    id
    name
  }
  }
`;

const GET_FILTER_SUPPLIERS = gql`
  query fsuppliers($excludedIds: [ID!]) {
    fsuppliers(excludedIds: $excludedIds) {
    id
    name
  }
  }
`;

declare var window: any;
@Component({
  selector: 'app-supplier-category',
  templateUrl: './supplier-category.component.html',
  styleUrls: ['./supplier-category.component.css']
})
export class SupplierCategoryComponent implements OnChanges, OnDestroy {
  @Input() catId:any;
  supplierModal: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  catName:string=''
  supplier:any
  supplierCompleteData:any;
  savedSuppliers:Array<String> = [];

  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo,private messageService: MessageService) { }

  
  ngOnChanges(changes: SimpleChanges): void {
    this.savedSuppliers = [];
    if(changes['catId'] && !changes['catId'].firstChange){
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
        if(data.category_supplier.length){
          this.supplier = data.category_supplier;
          for(var val of data.category_supplier){
            this.savedSuppliers.push(val.supplier.id)
            
          }
      }
       },
       error => {
         this.messageService.clear();
         this.messageService.add({severity:'error',  detail:'Not Able to fetch the Filter data!'});
       }
       )



    }
    
  }

  fetchSupplier(){
    this.supplierModal.show();
    console.log(this.savedSuppliers);
    if(this.savedSuppliers.length){

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
      }, error=>{
        this.messageService.add({severity:'error',  detail:'Not Able to fetch the Supplier data!'});
      })

    }else{
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
      }, error=>{
        this.messageService.add({severity:'error',  detail:'Not Able to fetch the Supplier data!'});
      })
    }
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
