import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { BetsListComponent } from './bets-list/bets-list.component';
import { BetsFormComponent } from './bets-form-component/bets-form-component.component';
import { BetsListElementComponent } from './bets-list-element/bets-list-element.component';
import { LoginComponent } from './communs/login/login.component';
import { FilesUploaderComponent } from './communs/files-uploader/files-uploader.component';


import {environment} from '../environments/environment';


const appRoutes: Routes = [
  { path: 'bet',      component: BetsFormComponent },
  { path: 'bet/:id',      component: BetsFormComponent },
  {
    path: 'bets',
    component: BetsListComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { baseUrl: environment.apiUrl.replace("/api/", "/") }
  },
  { path: '',
    redirectTo: '/bets',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BetsListComponent,
    BetsFormComponent,
    FileSelectDirective,
    BetsListElementComponent,
    LoginComponent,
    FilesUploaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
     RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
