import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { MessageService } from 'primeng/api';
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

const CREATE_CATEGORY_SUPPLIER = gql`
mutation createCategorySupplier($supplier_id: ID!, $category_id: ID! ) {
  createCategorySupplier(supplier_id: $supplier_id, category_id: $category_id) {
    id
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
  @Input() catId: any;
  supplierModal: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  catName: string = ''
  supplier: any
  supplierCompleteData: any;
  savedSuppliers: Array<String> = [];

  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo, private messageService: MessageService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.savedSuppliers = [];
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
        },
          error => {
            this.messageService.clear();
            this.messageService.add({ severity: 'error', detail: 'Not Able to fetch the Filter data!' });
          }
        )



    }

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

  //This function is to create a new supplier for tab

  addSupplier(event: any, id: any) {
    this.apollo
      .mutate({
        mutation: CREATE_CATEGORY_SUPPLIER,
        variables: {
          supplier_id: id,
          category_id: this.catId
        }
      })
      .subscribe((result: any) => {
        this.messageService.clear();
        if (result.data?.createCategorySupplier) {
          this.messageService.add({ severity: 'success', summary: 'yahooo!', detail: 'Supplier Added' });
        }
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Somthing is wrong with supplier', sticky: true });
        }
      );
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
