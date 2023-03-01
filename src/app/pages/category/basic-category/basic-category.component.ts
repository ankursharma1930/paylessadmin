import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';
import {MessageService} from 'primeng/api';

const GET_CATEGORY = gql`
  query category($id: ID!){
    category(id: $id){
      id 
      name
      link_to
      link_filter
      product_name_formula
      product_name_suffix
      path
      parent_id
    }
  }
`

const UPDATE_CATEGORY = gql`
mutation updateCategory($id: ID!, $name: String, $link_to:String, $link_filter:String, $product_name_formula:String, $product_name_suffix:String) {
  updateCategory(id: $id, name: $name, link_to:$link_to, link_filter:$link_filter, product_name_suffix:$product_name_suffix, product_name_formula:$product_name_formula) {
    id
    name
    link_to
    link_filter
    product_name_formula
    product_name_suffix
  }
}
`;
const variables:any = {}
@Component({
  selector: 'app-basic-category',
  templateUrl: './basic-category.component.html',
  styleUrls: ['./basic-category.component.css']
})
export class BasicCategoryComponent implements OnChanges {

  @Input() catId:any;

  catname:string = ''
  link_to:string = ''
  link_filter:string = ''
  product_name_formula:string = ''
  product_name_suffix:string = ''
  showSaveButton:boolean=false
  
  constructor(private apollo: Apollo,private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    
     if(changes['catId'] && !changes['catId'].firstChange){
      this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, its in progress..'});
       this.apollo
        .watchQuery<any>({
          query: GET_CATEGORY,
          variables: {
            id: this.catId
          },
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        })
        .valueChanges.subscribe(({ data, loading }) => {
          this.messageService.clear();
          this.catname = data.category.name
          this.link_to = data.category.link_to
          this.link_filter = data.category.link_filter
          this.product_name_formula = data.category.product_name_formula
          this.product_name_suffix = data.category.product_name_suffix

        })
     }
     this.showSaveButton = false;
  }

  onKeyUp(event:any) { 
    if(this.catId){
      this.showSaveButton = true;
    }
  }

  onSubmit(){
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, its in progress..', sticky: true});
    this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY,
        variables: {
          id:this.catId,
          name:this.catname,
          link_to:this.link_to?this.link_to:'',
          link_filter:this.link_filter?this.link_filter:'',
          product_name_formula:this.product_name_formula?this.product_name_formula:'',
          product_name_suffix:this.product_name_suffix?this.product_name_suffix:''
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.updateCategory){
          this.messageService.clear();
          this.messageService.add({severity:'success',  detail:'Category Basic Info Updated!'});
          
        }
      },
        error => {
          this.messageService.clear();
          this.messageService.add({severity:'error',  detail:'Something is wrong, please refresh the page and try again'});
        }
      );
  }

}
