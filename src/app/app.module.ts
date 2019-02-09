import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodolistComponent } from './components/todolist/todolist.component';
// import { AppRoutingModule } from './app-routing.module';
import { CreateitemComponent } from './components/createitem/createitem.component';
import {NgbModalModule, NgbTabsetModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';

// import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    CreateitemComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // AppRoutingModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbPaginationModule,
    // FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateitemComponent]
})
export class AppModule { }
