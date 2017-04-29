import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import { IdentifiedElement } from './indentified-element';

export class CrudService<T extends IdentifiedElement> {

  protected url:string;  // URL to web API
  protected options:RequestOptions;

  constructor (url:string, protected http: Http) {
    this.url = url;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }

  getAlls (): Observable<T[]> {
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

  getById (id: String): Observable<T> {
    return this.http.get(this.url+id, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  add (element: T): Observable<T> {
    return this.http.post(this.url, element, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateElement (element: T): Observable<T> {    
    return this.http.put(this.url+element._id, element, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteById (id: String): Observable<any> {
    return this.http.delete(this.url+id,this.options);
  }

}
