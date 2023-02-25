import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';

const GET_CATEGORY_SEO = gql`
  query category_seo($category_id: String!){
    category_seo(category_id: $category_id){
      id 
      
    }
  }
`

@Component({
  selector: 'app-seo-category',
  templateUrl: './seo-category.component.html',
  styleUrls: ['./seo-category.component.css']
})
export class SeoCategoryComponent implements OnChanges {

  @Input() catId:any;

  constructor(private apollo: Apollo) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['catId'] && !changes['catId'].firstChange){
      console.log(typeof this.catId);
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
         console.log(data);
         

       })
    }
  }

}
