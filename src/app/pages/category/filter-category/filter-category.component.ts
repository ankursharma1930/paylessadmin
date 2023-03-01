import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';
import {MessageService} from 'primeng/api';


const GET_CATEGORY_FILTER = gql`
  query category_filter($category_id: String!){
    category_filter(category_id: $category_id){
      id
      category_id
      type
      style
      gender_fit1
      gender_fit2
      gender_fit3
      gender_fit4
      material
    }
  }
`

const UPDATE_CATEGORY_FILTER = gql`
mutation upsertCategoryFilters($id: ID!, $category_id: Int!, 
        $type:String,
        $style:String,
        $gender_fit1:String,
        $gender_fit2:String,
        $gender_fit3:String,
        $gender_fit4:String,
        $material:String
        ) {
        upsertCategoryFilters(id: $id, category_id: $category_id,
       type:$type,
       style:$style,
       gender_fit1:$gender_fit1,
       gender_fit2:$gender_fit2,
       gender_fit3:$gender_fit3,
       gender_fit4:$gender_fit4,
       material:$material
  ) {
    id
    category_id
    type
    style
    gender_fit1
    gender_fit2
    gender_fit3
    gender_fit4
    material
  }
}
`;

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.css'],
  providers: [MessageService]
})
export class FilterCategoryComponent implements OnChanges {

  @Input() catId:any;
  filter_id!:string;
  type:string = '';
  style:string= '';
  gender_fit1:string= '';
  gender_fit2:string= '';
  gender_fit3:string= '';
  gender_fit4:string= '';
  material:string= '';

  
  showSaveButton:boolean = false;


  constructor(private apollo: Apollo,private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['catId'] && !changes['catId'].firstChange){

      this.apollo
       .watchQuery<any>({
         query: GET_CATEGORY_FILTER,
         variables: {
          category_id: this.catId
         },
         fetchPolicy: 'no-cache',
         errorPolicy: 'ignore'
       })
       .valueChanges.subscribe(({ data, loading }) => {
        
        if(data.category_filter){
          this.filter_id = data.category_filter.id;
          this.type = data.category_filter.type;
          this.style = data.category_filter.style;
          this.gender_fit1 = data.category_filter.gender_fit1;
          this.gender_fit2 = data.category_filter.gender_fit2;
          this.gender_fit3 = data.category_filter.gender_fit3;
          this.gender_fit4 = data.category_filter.gender_fit4;
          this.material = data.category_filter.material;
      }else{
        this.filter_id = '';
          this.type = '';
          this.style = '';
          this.gender_fit1 = '';
          this.gender_fit2 = '';
          this.gender_fit3 = '';
          this.gender_fit4 = '';
          this.material = '';
        
      }
       },
       error => {
         this.messageService.clear();
         this.messageService.add({severity:'error',  detail:'Not Able to fetch the Filter data!'});
       }
       )
       
    }
    this.showSaveButton = false;
  }

  onKeyUp(event:any){
    this.showSaveButton = true;
  }
  onChange(event:any){
    this.showSaveButton = true;
  }

  onSubmitFilter(){
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, its in progress..', sticky: true});

    this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY_FILTER,
        variables: {
          id:this.catId,
          category_id:Number(this.catId),
          type:this.type,
          style:this.style,
          gender_fit1:this.gender_fit1,
          gender_fit2:this.gender_fit2,
          gender_fit3:this.gender_fit3,
          gender_fit4:this.gender_fit4,
          material:this.material
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.upsertCategoryFilters){
          console.log("updated");
          this.messageService.clear();
          this.messageService.add({severity:'success',  detail:'Category Filter Info Updated!'});
          
        }
      },
        error => {
          this.messageService.clear();
          this.messageService.add({severity:'error',  detail:'Something is wrong, please refresh the page and try again'});
        }
      );

  }


}
