import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';





@Component({
	moduleId: module.id,
	selector: 'bets-form',
	templateUrl: './bets-form-component.component.html',
	styleUrls: ['./bets-form-component.component.scss'],
	providers: [],

})
export class BetsFormComponent implements OnInit {
	private mode:String;


	constructor(private router: Router,private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.mode = 'PROPOSAL';
	}
}
