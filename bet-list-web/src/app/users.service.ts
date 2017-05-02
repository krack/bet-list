import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from '../environments/environment';

import { User } from './model/user';

@Injectable()
export class UserService {
  private connectedUser: BehaviorSubject<User> = new BehaviorSubject(new User());

  private url = environment.apiUrl+'users/';  // URL to web API
  private options:RequestOptions;
  constructor (private http: Http) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }

  getAll (): Observable<User[]> {
    return this.http.get(this.url, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json(); 
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

  getById (id: String): Observable<User> {
    return this.http.get(this.url+id, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  getConnectedUser(): Observable<User>{
  	
	 this.http.get(environment.apiUrl+'me', this.options)
                .map(this.extractData).subscribe(
     	 result => {
     	 	this.connectedUser.next(result)
     	 }
      );

    return this.connectedUser.asObservable();
  }
}
