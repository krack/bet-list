import { Component, Provider, forwardRef, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'angularjs-nodejs-framework/client/services/user';





@Component({
	moduleId: module.id,
	selector: 'display-user',
	templateUrl: './display-user.component.html',
	styleUrls: ['./display-user.component.scss'],
	providers: []

})
export class DisplayUserComponent implements OnInit {

	@Input()
	private user: User;

	@Input()
	private top: boolean;


	constructor() {
		this.user = new User(undefined);
	}

	ngOnInit() {
	}


}
