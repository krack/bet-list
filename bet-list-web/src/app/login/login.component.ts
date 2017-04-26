import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../users.service';
import { User } from '../model/user';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:  [UserService]
})
export class LoginComponent implements OnInit {
  private connected:User;
  constructor(private usersService: UserService, private domSanitizer:DomSanitizer, public router:Router) { }
 	ngOnInit() {
 		let intervalId = setInterval(()=> {       
      		this.usersService.getConnectedUser().subscribe((user: User)=>{
      			if(user._id){
      		 		this.connected = user;
    				clearInterval(intervalId);
    				this.router.navigate(['/']);
    			}
      		});
      	},1000); 
 	}
  getUrl() {
  	let url = environment.apiUrl.replace("/api/", "/")+'auth/facebook';
  	return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
