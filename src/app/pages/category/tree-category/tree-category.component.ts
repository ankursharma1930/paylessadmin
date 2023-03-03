import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { TreeDragDropService, TreeNodeDragEvent  } from 'primeng/api';
import { Apollo, gql } from 'apollo-angular';
import { Subject, Subscription } from 'rxjs';


interface Category {
  id: number;
  name: string;
  path: string;
  
}
interface UpdatedInterface {
  key: any;
  label: any;
  path:any;
  parent_id:any;
}

const GET_CATEGORIES = gql`
  query categories {
    categories {
    id
    name
    path
    parent_id
    link_to
    link_filter
  }
  }
`;

const GET_CATEGORY = gql`
  query category($id: ID!){
    category(id: $id){
      id 
      name
      path
      parent_id
    }
  }
`

const UPDATE_CATEGORY = gql`
  mutation updateCategory($id: ID!, $path: String, $parent_id: String){
    updateCategory(id: $id, path:$path, parent_id:$parent_id){
      id
      path
      parent_id
    }
  }

`

@Component({
  selector: 'app-tree-category',
  templateUrl: './tree-category.component.html',
  styleUrls: ['./tree-category.component.css'],
  providers: [TreeDragDropService]
})
export class TreeCategoryComponent implements OnInit {
  
  @Output() catIdEvent = new EventEmitter<string>();

  nodes: TreeNode[] = [];
  loading: boolean = true;
  category: any
  name!: string;
  id: any;
  error:any;
  categories: Category[] = [];
  newCategory:any;
  updatedCategory: UpdatedInterface[] = [];
  parentId: string = "1";
  dropNode!:string;
  dropedNodeId!:string;
  dragNodepath!:string;
  newPath!:string;
  newParent!:string;
  

  private querySubscription: Subscription | undefined

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
        
  }

   expandAll(){
        this.nodes.forEach( node => {
            this.expandRecursive(node, true);
        } );
    }

    collapseAll(){
        this.nodes.forEach( node => {
            this.expandRecursive(node, false);
        } );
    }

    private expandRecursive(node:TreeNode, isExpand:boolean){
        node.expanded = isExpand;
        if (node.children){
            node.children.forEach( childNode => {
                this.expandRecursive(childNode, isExpand);
            } );
        }
    }


    getAllCategory(){
      this.loading = true;
      this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_CATEGORIES,
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
      for(let item of Object.keys(data.categories)) {
          if(data.categories[item].link_to || data.categories[item].link_filter){
            data.categories[item].name = data.categories[item].name+" - HotLink";
          }
      }
      this.categories = data.categories;

        this.updatedCategory = this.categories.map((obj: any)=>{
          const { id, name, path, parent_id  } = obj;
          return { 
            key: id, // Change the key name from "id" to "newId"
            label: name, // Change the key name from "name" to "fullName"
            path:path,
            parent_id:parent_id
          };
        })
        this.newCategory = this.updatedCategory;
        this.nodes = this.getChildren(this.parentId)
        
      })
    }

    getChildren(parentId: string): any {
      const children = this.newCategory.filter((category:any) => {
        return category.path.startsWith(`${parentId}/`) && category.path.split('/').length === parentId.split('/').length + 1;
      });
      return children.map((child:any) => {
        const { key, label } = child;
        const grandchildren = this.getChildren(`${parentId}/${key}`);
        return { key, label, children: grandchildren };
      });
    }
    

    onNodeDrop(event:any):any {
      this.loading = true;
        //get parent/drop node path
      if(event.dragNode.children.length == 0){
        this.querySubscription = this.apollo
        .watchQuery<any>({
          query: GET_CATEGORY,
          variables: {
            id: event.dropNode.key
          },
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        })
        .valueChanges.subscribe(({ data, loading }) => {
          
          this.dragNodepath = data.category.path;
          
          this.newParent = data.category.id;
          this.newPath = this.dragNodepath+"/"+event.dragNode.key;
          

          this.updateCategoryPath(this.newPath, this.newParent, event.dragNode.key);
        })
      }else{
        alert("This node may have childern, this drop will not get save in database")
        window.location.reload();
      }
    }

    updateCategoryPath(path:any, parent:any, id:any){
      this.apollo
      .mutate({
        mutation: UPDATE_CATEGORY,
        variables: { 
          id:id,
          path:path,
          parent_id:parent
        }
      })
      .subscribe((result: any) => {
        this.loading = false;
        if(result.data?.updateCategory){
          console.log("category updated");
        }
        
      },
        error => {
          console.log("there is an error contact developer")
        },
        
      );
    }

    onSelectCategory(event:any){
      this.catIdEvent.emit(event.node.key);
    }

}
