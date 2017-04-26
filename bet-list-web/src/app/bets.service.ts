import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from '../environments/environment';

import { Bet } from './model/bet';

@Injectable()
export class BetsService {

  private url = environment.apiUrl+'bets/';  // URL to web API
  private options:RequestOptions;
  constructor (private http: Http) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }

  getBets (): Observable<Bet[]> {
    return this.http.get(this.url, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();    
    console.log(body);
    return body || { };
  }
  private handleError (error: Response | any) {
   /* // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);*/
    return Observable.throw(error.status);
  }

  getBet (id: String): Observable<Bet> {
    return this.http.get(this.url+id, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  addBet (bet: Bet): Observable<Bet> {
    return this.http.post(this.url, bet, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateBet (bet: Bet): Observable<Bet> {    
    return this.http.put(this.url+bet._id, bet, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteBet (id: String): Observable<any> {
    return this.http.delete(this.url+id,this.options);
  }

   deleteImage (idBet: String, idFile: String): Observable<any> {
    return this.http.delete(this.url+idBet+"/files/"+idFile, this.options);
  }
}
