import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ElementComponent, UsersService, User } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';

import { Bet } from '../model/bet';
import { BetsService } from '../bets.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload'

import { environment } from '../../environments/environment';

const URL = environment.apiUrl + 'bets/';

@Component({
	moduleId: module.id,
	selector: 'bet-proposal-form',
	templateUrl: './bet-proposal-form-component.component.html',
	styleUrls: ['./bet-proposal-form-component.component.scss'],
	providers: [BetsService, UsersService],

})
export class BetProposalFormComponent extends ElementComponent<Bet> implements OnInit {
	private usersService: UsersService;
	public otherUsers: User[] = [];
	private connected: User;


	constructor(router: Router, route: ActivatedRoute, betsService: BetsService, usersService: UsersService) {
		super('/bet/', betsService, router, route);
		this.usersService = usersService;
		this.element = new Bet(undefined);
		this.element.status = 'proposed';
		this.connected = new User(undefined);
	}

	ngOnInit() {
		this.initElementFromUrlParameter().subscribe(() => {
		});
		this.usersService.getConnectedUser().subscribe((user: User) => {
			if (user) {
				this.connected = user;
				console.log(this.connected);
				this.element.applicant = this.connected._id;
			}
		});
		this.usersService.getAlls().subscribe((users: User[]) => {
			this.otherUsers = users.filter(obj => obj._id !== this.connected._id);
		});

	}
}
