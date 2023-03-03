import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';
import { Apollo, gql, Subscription } from 'apollo-angular';
import {MessageService} from 'primeng/api';


const CREATE_CATEGORY = gql`
mutation createCategory($name: String!, $parent_id: Int ) {
  createCategory(name: $name, parent_id: $parent_id) {
    id
    name
  }
}
`;

declare var window:any;
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnChanges {
  @Input() catId:any;
  createModal:any;
  categoryName:string='';
  parent_id:any;
  disablebutton:boolean = false;
  constructor(private apollo: Apollo,private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createModal = new window.bootstrap.Modal(
      document.getElementById('createModal')
    );
    this.categoryName = '';
    this.disablebutton = false;
  }
  openCreateModal(){
    this.createModal.show();
  }
  onSubmitCategory():any{

    if(!this.catId || !this.categoryName){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Parent Category Id or new category name is missing, Please select parent category first.', sticky: true});
      return;
    }
    this.disablebutton = true;
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Please wait, its in progress..'});
    this.parent_id = Number(this.catId);
    this.apollo
      .mutate({
        mutation: CREATE_CATEGORY,
        variables: { 
          name:this.categoryName,
          parent_id:this.parent_id
        }
      })
      .subscribe((result: any) => {
        this.messageService.clear();
        if(result.data?.createCategory){
          this.messageService.add({severity:'success', summary: 'yahooo!', detail: 'Please select the newly created category from tree and update the other info.'});
        }
      },
        error => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Somthing is wrong!', sticky: true});
        }
      );
  }
  
  onKeyChange(even:any){
    this.disablebutton = false;
  }
}
