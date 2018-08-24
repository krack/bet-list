import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { DisplayUserComponent } from './display-user/display-user.component';
import { BetsListComponent } from './bets-list/bets-list.component';
import { BetsFormComponent } from './bets-form-component/bets-form-component.component';
import { BetsListElementComponent } from './bets-list-element/bets-list-element.component';
import { BetResultFormComponent } from './bet-result-form-component/bet-result-form-component.component';
import { BetProposalFormComponent } from './bet-proposal-form-component/bet-proposal-form-component.component';
import { LoginComponent } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';
import { FilesUploaderComponent, AppSettings } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';



import { environment } from '../environments/environment';
import { FilterPipe } from './filter.pipe';


const appRoutes: Routes = [
  { path: 'bet', component: BetsFormComponent },
  { path: 'bet/:id', component: BetsFormComponent },
  {
    path: 'bets',
    component: BetsListComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { baseUrl: environment.apiUrl.replace("/api/", "/") }
  },
  {
    path: '',
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
    FilesUploaderComponent,
    BetResultFormComponent,
    BetProposalFormComponent,
    FilterPipe,
    SelectUserComponent,
    DisplayUserComponent
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
export class AppModule {
  constructor() {
    AppSettings.API_ENDPOINT = environment.apiUrl;
  }
}
