import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';
import {MessageService} from 'primeng/api';


const GET_CATEGORY_SEO = gql`
  query category_seo($category_id: String!){
    category_seo(category_id: $category_id){
      id 
      alternat_name1
      alternat_name2
      alternat_name3
      alternat_name4
      mark_name1
      mark_name2
      mark_name3
      mark_name4
      product_keyword1
      product_keyword2
      product_keyword3
      product_keyword4
      mark_keyword1
      mark_keyword2
      mark_keyword3
      mark_keyword4
      mark_all
      keyword
      mark_meta_key
      title
      mark_title
      meta_description
      mark_meta_desc
    }
  }
`

const UPDATE_CATEGORY_SEO = gql`
mutation upsertCategorySeo($id: ID!, $category_id: Int!, 
        $alternat_name1: String,
        $alternat_name2: String,
        $alternat_name3: String,
        $alternat_name4: String,
        $mark_name1: Int,
        $mark_name2: Int,
        $mark_name3: Int,
        $mark_name4: Int,
        $product_keyword1: String,
        $product_keyword2: String,
        $product_keyword3: String,
        $product_keyword4: String,
        $mark_keyword1: Int,
        $mark_keyword2: Int,
        $mark_keyword3: Int,
        $mark_keyword4: Int,
        $mark_all: Int,
        $keyword: String,
        $mark_meta_key: Int,
        $title: String,
        $mark_title: Int,
        $meta_description: String,
        $mark_meta_desc: Int
        ) {
  upsertCategorySeo(id: $id, category_id: $category_id,
        alternat_name1:$alternat_name1,
        alternat_name2:$alternat_name2,
        alternat_name3:$alternat_name3,
        alternat_name4:$alternat_name4,
        mark_name1:$mark_name1,
        mark_name2:$mark_name2,
        mark_name3:$mark_name3,
        mark_name4:$mark_name4,
        product_keyword1:$product_keyword1,
        product_keyword2:$product_keyword2,
        product_keyword3:$product_keyword3,
        product_keyword4:$product_keyword4,
        mark_keyword1:$mark_keyword1,
        mark_keyword2:$mark_keyword2,
        mark_keyword3:$mark_keyword3,
        mark_keyword4:$mark_keyword4,
        mark_all:$mark_all,
        keyword:$keyword,
        mark_meta_key:$mark_meta_key,
        title:$title,
        mark_title:$mark_title,
        meta_description:$meta_description,
        mark_meta_desc:$mark_meta_desc
    
  ) {
    id
    category_id
    alternat_name1
    alternat_name2
    alternat_name3
    alternat_name4
    mark_name1
    mark_name2
    mark_name3
    mark_name4
    product_keyword1
    product_keyword2
    product_keyword3
    product_keyword4
    mark_keyword1
    mark_keyword2
    mark_keyword3
    mark_keyword4
    mark_all
    keyword
    mark_meta_key
    title
    mark_title
    meta_description
    mark_meta_desc
    
    
  }
}
`;

@Component({
  selector: 'app-seo-category',
  templateUrl: './seo-category.component.html',
  styleUrls: ['./seo-category.component.css']
})
export class SeoCategoryComponent implements OnChanges {

  @Input() catId:any;
  seo_id!:string;
  alternat_name1:string = '';
  alternat_name2:string= '';
  alternat_name3:string= '';
  alternat_name4:string= '';
  mark_name1:any='';
  mark_name2:any= '';
  mark_name3:any= '';
  mark_name4:any= '';
  product_keyword1:string= '';
  product_keyword2:string= '';
  product_keyword3:string= '';
  product_keyword4:string= '';
  mark_keyword1:any= '';
  mark_keyword2:any= '';
  mark_keyword3:any= '';
  mark_keyword4:any= '';
  mark_all:any= 0;
  keyword:string= '';
  mark_meta_key:any='';
  title:string= '';
  mark_title:any='';
  meta_description:string= '';
  mark_meta_desc:any='';
  showSaveButton:boolean = false;


  constructor(private apollo: Apollo,private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['catId'] && !changes['catId'].firstChange){

      this.apollo
       .watchQuery<any>({
         query: GET_CATEGORY_SEO,
         variables: {
          category_id: this.catId
         },
         fetchPolicy: 'no-cache',
         errorPolicy: 'ignore'
       })
       .valueChanges.subscribe(({ data, loading }) => {
        
        if(data.category_seo){
          this.seo_id = data.category_seo.id;
          this.alternat_name1 = data.category_seo.alternat_name1;
          this.alternat_name2 = data.category_seo.alternat_name2;
          this.alternat_name3 = data.category_seo.alternat_name3;
          this.alternat_name4 = data.category_seo.alternat_name4;
          this.mark_name1 = Number(data.category_seo.mark_name1);
          this.mark_name2 = Number(data.category_seo.mark_name2);
          this.mark_name3 = Number(data.category_seo.mark_name3);
          this.mark_name4 = Number(data.category_seo.mark_name4);
          this.product_keyword1 = data.category_seo.product_keyword1;
          this.product_keyword2 = data.category_seo.product_keyword2;
          this.product_keyword3 = data.category_seo.product_keyword3;
          this.product_keyword4 = data.category_seo.product_keyword4;
          this.mark_keyword1 = Number(data.category_seo.mark_keyword1);
          this.mark_keyword2 = Number(data.category_seo.mark_keyword2);
          this.mark_keyword3 = Number(data.category_seo.mark_keyword3);
          this.mark_keyword4 = Number(data.category_seo.mark_keyword4);
          this.mark_all = Number(data.category_seo.mark_all);
          this.keyword = data.category_seo.keyword;
          this.mark_meta_key= Number(data.category_seo.mark_meta_key);
          this.title = data.category_seo.title;
          this.mark_title = Number(data.category_seo.mark_title);
          this.meta_description = data.category_seo.meta_description;
          this.mark_meta_desc =Number(data.category_seo.mark_meta_desc);
      }else{
        this.alternat_name1 = '';
        this.alternat_name2= '';
        this.alternat_name3= '';
        this.alternat_name4= '';
        this.mark_name1= 0;
        this.mark_name2= 0;
        this.mark_name3= 0;
        this.mark_name4= 0;
        this.product_keyword1= '';
        this.product_keyword2= '';
        this.product_keyword3= '';
        this.product_keyword4= '';
        this.mark_keyword1= 0;
        this.mark_keyword2= 0;
        this.mark_keyword3= 0;
        this.mark_keyword4= 0;
        this.mark_all= 0;
        this.keyword= '';
        this.mark_meta_key = 0;
        this.title= '';
        this.mark_title = 0;
        this.meta_description= '';
        this.mark_meta_desc=0;
        
      }
       },
       error => {
         this.messageService.clear();
         this.messageService.add({severity:'error',  detail:'Not Able to fetch the SEO data!'});
       }
       )
       
    }
    this.showSaveButton = false;
  }

  onKeyUp(event:any){
    if(this.catId){
      if(event.target.id=="alternat_name1"){
        this.mark_name1 = 1;
      }
      if(event.target.id=="alternat_name2"){
        this.mark_name2 = 1;
      }
      if(event.target.id=="alternat_name3"){
        this.mark_name3 = 1;
      }
      if(event.target.id=="alternat_name4"){
        this.mark_name4 = 1;
      }
      if(event.target.id=="product_keyword1"){
        this.mark_keyword1 = 1;
      }
      if(event.target.id=="product_keyword2"){
        this.mark_keyword2 = 1;
      }
      if(event.target.id=="product_keyword3"){
        this.mark_keyword3 = 1;
      }
      if(event.target.id=="product_keyword4"){
        this.mark_keyword4 = 1;
      }
      if(event.target.id=="keyword"){
        this.mark_meta_key = 1;
      }
      if(event.target.id=="title"){
        this.mark_title = 1;
      }
      if(event.target.id=="meta_description"){
        this.mark_meta_desc = 1;
      }
      
      this.showSaveButton = true;
    }
    this.mark_all = 0;
  }
  onChangeCheckbox(event:any){
    //console.log(this.mark_all);
    if(this.mark_all){
      this.showSaveButton = true;
      this.mark_all = 1;
      this.mark_meta_key = this.mark_title = this.mark_meta_desc = this.mark_name1 = this.mark_name2 = this.mark_name3 = this.mark_name4 = this.mark_keyword1 = this.mark_keyword2 = this.mark_keyword3 = this.mark_keyword4 = 0;    
    }else{
      this.mark_all = 0;
    }
  }
  


  onSubmitSeo(){
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, its in progress..', sticky: true});
    this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY_SEO,
        variables: {
          id:this.catId,
          category_id:Number(this.catId),
          alternat_name1:this.alternat_name1,
          alternat_name2:this.alternat_name2,
          alternat_name3:this.alternat_name3,
          alternat_name4:this.alternat_name4,
          mark_name1:Number(this.mark_name1),
          mark_name2:Number(this.mark_name2),
          mark_name3:Number(this.mark_name3),
          mark_name4:Number(this.mark_name4),
          product_keyword1:this.product_keyword1,
          product_keyword2:this.product_keyword2,
          product_keyword3:this.product_keyword3,
          product_keyword4:this.product_keyword4,
          mark_keyword1:Number(this.mark_keyword1),
          mark_keyword2:Number(this.mark_keyword2),
          mark_keyword3:Number(this.mark_keyword3),
          mark_keyword4:Number(this.mark_keyword4),
          mark_all:Number(this.mark_all),
          keyword:this.keyword,
          mark_meta_key:Number(this.mark_meta_key),
          title:this.title,
          mark_title:Number(this.mark_title),
          meta_description:this.meta_description,
          mark_meta_desc:Number(this.mark_meta_desc)
        }
      })
      .subscribe((result: any) => {
        
        if(result.data?.upsertCategorySeo){
          console.log("updated");
          this.messageService.clear();
          this.messageService.add({severity:'success',  detail:'Category SEO Info Updated!'});
          
        }
      },
        error => {
          this.messageService.clear();
          this.messageService.add({severity:'error',  detail:'Something is wrong, please refresh the page and try again'});
        }
      );
  }

}
