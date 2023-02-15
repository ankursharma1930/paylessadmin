import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';



import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { InMemoryCache } from '@apollo/client/core'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { HeaderComponent } from './include/header/header.component';
import { FooterComponent } from './include/footer/footer.component';
import { SidebarComponent } from './include/sidebar/sidebar.component';
import { TestComponent } from './include/test/test.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { DataTablesModule } from 'angular-datatables';
import { TestauthComponent } from './pages/testauth/testauth.component';
import { UserCreateComponent } from './pages/users-management/user-create/user-create.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { SupplierCreateComponent } from './pages/supplier/supplier-create/supplier-create.component';
import { ApiSupplierComponent } from './pages/supplier/api-supplier/api-supplier.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Login' },
  {path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  {path: 'usermanage', component:UsersManagementComponent,title: 'User Management' },
  {path: 'supplier', component:SupplierComponent, title: 'Supplier' },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  {path: '**', component: NotfoundComponent, title: '404 Not Found' }
]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    NotfoundComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    TestComponent,
    UsersManagementComponent,
    TestauthComponent,
    UserCreateComponent,
    SupplierComponent,
    SupplierCreateComponent,
    ApiSupplierComponent
  ],
  imports: [
    ApolloModule, HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
