import { Component , OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';

import { UsersService, User } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss' ],
  providers:  [ UsersService]
})
export class AppComponent implements OnInit {
	public connected:User;
	constructor(private usersService: UsersService) { }

  ngOnInit() {
     this.usersService.getConnectedUser().subscribe(
     	user=> this.connected = user);
  }
}
