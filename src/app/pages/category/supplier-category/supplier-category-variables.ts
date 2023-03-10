import { Apollo, gql } from 'apollo-angular';
export const GET_CATEGORY_SUPPLIER = gql`
query category_supplier($category_id: Int!){
  category_supplier(category_id: $category_id){
    id
    category_id
    lead_time
    default_mark_up
    mark_up_by_quantity
    selected_branding
    website_branding
    supplier_price_break
    min_qty
    web_qty
    brand
    supplier{
      id
      name
    }
  }
}
`;

export const GET_CATEGORY_SUPPLIER_BYID = gql`
  query particular_category_supplier($id: ID!){
    particular_category_supplier(id: $id){
      id
      category_id
      lead_time
      default_mark_up
      mark_up_by_quantity
      selected_branding
      website_branding
      supplier_price_break
      min_qty
      web_qty
      brand
      supplier{
        id
        name
      }
    }
  }
`

export const GET_CATEGORY = gql`
query category($id: ID!){
  category(id: $id){
    name
  }
}
`

export const GET_FILTER_SUPPLIERS = gql`
query fsuppliers($excludedIds: [ID!]) {
  fsuppliers(excludedIds: $excludedIds) {
  id
  name
}
}
`;

export const CREATE_CATEGORY_SUPPLIER = gql`
mutation createCategorySupplier($supplier_id: ID!, $category_id: ID!, $mark_up_by_quantity: String, $supplier_price_break:String, $web_qty:String, $brand:String) {
  createCategorySupplier(supplier_id: $supplier_id, category_id: $category_id, mark_up_by_quantity:$mark_up_by_quantity, supplier_price_break:$supplier_price_break, web_qty:$web_qty, brand:$brand) {
    id
  }
}
`;

export const UPDATE_CATEGORY_SUPPLIER = gql`
mutation updateCategorySupplier($id:ID!, $category_id: ID!, $lead_time:String, $default_mark_up:String,$mark_up_by_quantity:String, $supplier_price_break:String, $min_qty:String,$web_qty:String, $brand:String ) {
  updateCategorySupplier(id: $id, category_id: $category_id, lead_time:$lead_time, default_mark_up:$default_mark_up, mark_up_by_quantity:$mark_up_by_quantity, supplier_price_break:$supplier_price_break, min_qty:$min_qty,web_qty:$web_qty, brand:$brand) {
    id
    category_id
    lead_time
    default_mark_up
    mark_up_by_quantity
    supplier_price_break
    min_qty
    brand
  }
}
`;

export const DELETE_CATEGORY_SUPPLIER = gql`
mutation deleteCategorySupplier($id: ID!) {
  deleteCategorySupplier(id: $id) {
    id
  }
}
`;

interface Qty {
  qty?: string
  realvalue?: string
}

export const QuantitySlab: Qty[] = [
  { qty: "1" },
  { qty: "5" },
  { qty: "12" },
  { qty: "25" },
  { qty: "50" },
  { qty: "100" },
  { qty: "250" },
  { qty: "500" },
  { qty: "1000" },
  { qty: "2500" },
  { qty: "5000" },
  { qty: "10000" },
  { qty: "25000" },
  { qty: "50000" },
  { qty: "100000" },
  { qty: "250000" }, { qty: "500000" }, { qty: "1000000" },
]

interface PriceBreak {
  position?: string
  realvalue?: string
}

export const AllPriceBreak: PriceBreak[] = [
  { position: "1" },
  { position: "2" },
  { position: "3" },
  { position: "4" },
  { position: "5" },
  { position: "6" },
  { position: "7" },
  { position: "8" },
  { position: "9" },
  { position: "10" }

]

export const Brands: PriceBreak[] = [
  { position: "1" },
  { position: "2" },
  { position: "3" },
  { position: "4" },
  { position: "5" },
  { position: "6" },
  { position: "7" },
  { position: "8" }

]