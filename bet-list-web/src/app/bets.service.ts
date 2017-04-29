import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from '../environments/environment';

import { Bet } from './model/bet';
import { CrudService } from './communs/crud-service.service';

@Injectable()
export class BetsService extends CrudService<Bet>{

  constructor (http: Http) {
    super(environment.apiUrl+'bets/', http);
  }

  deleteImage (idBet: String, idFile: String): Observable<any> {
    return this.http.delete(this.url+idBet+"/files/"+idFile, this.options);
  }
}
