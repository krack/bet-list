import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(    private route: ActivatedRoute, private router: Router) { }

 	ngOnInit() {
 		    this.route.data
      .subscribe((data: { baseUrl: string }) => {
      	window.location.href = data.baseUrl+'auth/facebook'
      });
 	
 		
 	}

}
