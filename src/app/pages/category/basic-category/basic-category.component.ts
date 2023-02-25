import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';


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

@Component({
  selector: 'app-basic-category',
  templateUrl: './basic-category.component.html',
  styleUrls: ['./basic-category.component.css']
})
export class BasicCategoryComponent implements OnChanges {

  @Input() catId:any;

  catname!:string
  link_to!:string
  link_filter!:string
  product_name_formula!:string
  product_name_suffix!:string
  constructor(private apollo: Apollo) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['catId']);
    console.log(changes['catId'].firstChange);
    console.log(this.catId);
     if(changes['catId'] && !changes['catId'].firstChange){
      
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
          console.log(data);
          this.catname = data.category.name
          this.link_to = data.category.link_to
          this.link_filter = data.category.link_filter
          this.product_name_formula = data.category.product_name_formula
          this.product_name_suffix = data.category.product_name_suffix

        })
     }
  }

}
