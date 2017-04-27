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
  constructor(private usersService: UserService, private domSanitizer:DomSanitizer, public router:Router) { }
 	ngOnInit() {
 		window.location.href = environment.apiUrl.replace("/api/", "/")+'auth/facebook'
 	}

}
