import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { TreeDragDropService } from 'primeng/api';
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

const GET_CATEGORY = gql`
  query categories {
    categories {
    id
    name
    path
    parent_id
  }
  }
`;

@Component({
  selector: 'app-tree-category',
  templateUrl: './tree-category.component.html',
  styleUrls: ['./tree-category.component.css'],
  providers: [TreeDragDropService]
})
export class TreeCategoryComponent implements OnInit {
  files1: TreeNode[] = [];
	files2: TreeNode[] = [];
  nodes: TreeNode[] = [
    {
      key:"1",
      label: "Default Category"
    }
  ];
  loading: boolean | undefined
  category: any
  name!: string;
  id: any;
  error:any;
  categories: Category[] = [];
  newCategory:any;
  updatedCategory: UpdatedInterface[] = [];
  parentId: string = "1";

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
      this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_CATEGORY
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        
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
        this.nodes[0].children = this.getChildren(this.parentId)
        
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
    

}
