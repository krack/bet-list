import { Component , OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { UserService } from './users.service';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss' ],
  providers:  [ UserService]
})
export class AppComponent implements OnInit {
	public connected:User;
	constructor(private usersService: UserService) { }

  ngOnInit() {
     this.usersService.getConnectedUser().subscribe(
     	user=> this.connected = user);
  }
}
