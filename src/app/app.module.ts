import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodolistComponent } from './components/todolist/todolist.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateitemComponent } from './components/createitem/createitem.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    CreateitemComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModalModule,
    // FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateitemComponent]
})
export class AppModule { }
