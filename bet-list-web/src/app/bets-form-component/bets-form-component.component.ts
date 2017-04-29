import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ElementComponent } from '../communs/elements-component';

import { Bet } from '../model/bet';
import { File } from '../communs/file';
import { User } from '../model/user';
import { BetsService } from '../bets.service';
import { UserService } from '../users.service';
import { FileUploader, FileSelectDirective} from 'ng2-file-upload'

import {environment} from '../../environments/environment';

const URL =  environment.apiUrl+'bets/';

@Component({
	moduleId: module.id,
	selector: 'bets-form',
	templateUrl: './bets-form-component.component.html',
	styleUrls: ['./bets-form-component.component.scss'],
	providers: [BetsService, UserService],

})
export class BetsFormComponent extends ElementComponent<Bet> implements OnInit {
	private usersService:UserService;
	public users:User[] = [];


	constructor( router: Router, route: ActivatedRoute, betsService: BetsService, usersService: UserService) {
		super(betsService, router, route);
		this.usersService= usersService;
		this.element = new Bet(undefined);
	}

	ngOnInit() {
		this.initElementFromUrlParameter();

		this.usersService.getAll().subscribe((users: User[]) => this.users = users);
	}
}
