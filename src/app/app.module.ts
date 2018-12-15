import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodolistComponent } from './components/todolist/todolist.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateitemComponent } from './components/createitem/createitem.component';
// import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    CreateitemComponent,
    // ListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
