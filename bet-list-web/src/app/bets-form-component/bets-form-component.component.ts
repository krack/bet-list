import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ElementComponent, UsersService, User } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';

import { Bet } from '../model/bet';
import { BetsService } from '../bets.service';
import { FileUploader, FileSelectDirective} from 'ng2-file-upload'

import {environment} from '../../environments/environment';

const URL =  environment.apiUrl+'bets/';

@Component({
	moduleId: module.id,
	selector: 'bets-form',
	templateUrl: './bets-form-component.component.html',
	styleUrls: ['./bets-form-component.component.scss'],
	providers: [BetsService, UsersService],

})
export class BetsFormComponent extends ElementComponent<Bet> implements OnInit {
	private usersService:UsersService;
	public users:User[] = [];


	constructor( router: Router, route: ActivatedRoute, betsService: BetsService, usersService: UsersService) {
		super("/bet/", betsService, router, route);
		this.usersService= usersService;
		this.element = new Bet(undefined);
	}

	ngOnInit() {
		this.initElementFromUrlParameter().subscribe(() => {
		});

		this.usersService.getAlls().subscribe((users: User[]) => this.users = users);
	}
}
