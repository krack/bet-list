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
	selector: 'bet-result-form',
	templateUrl: './bet-result-form-component.component.html',
	styleUrls: ['./bet-result-form-component.component.scss'],
	providers: [BetsService, UsersService],

})
export class BetResultFormComponent extends ElementComponent<Bet> implements OnInit {
	private usersService: UsersService;
	public users: User[] = [];


	constructor(router: Router, route: ActivatedRoute, betsService: BetsService, usersService: UsersService) {
		super('/bet/', betsService, router, route);
		this.usersService = usersService;
		this.element = new Bet(undefined);
		this.element.status = 'played';
	}

	ngOnInit() {
		this.initElementFromUrlParameter().subscribe(() => {
		});

		this.usersService.getAlls().subscribe((users: User[]) => this.users = users);
	}

	saveElement(): void {
		this.element.victoriesConditions = 'Déjà parié';
		this.element.acceptorBet = this.element.applicantBet;
		this.element.winneur = this.element.applicant;
		super.saveElement();
	}
}
