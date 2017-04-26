import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';



import { Bet } from '../model/bet';
import { File } from '../model/file';
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
export class BetsFormComponent implements OnInit {
	public uploader:FileUploader;
	public users:User[] = [];
	url:String;
	errorMessage: string;
	model = new Bet();

	submitted = false;

	constructor( private router: Router, private route: ActivatedRoute, private betsService: BetsService, private usersService: UserService,private domSanitizer:DomSanitizer) { }

	ngOnInit() {
		this.route.params
		// (+) converts string 'id' to a number
		.subscribe((params: Params) => {
			let id = params['id']
			if(id){
				this.uploader = new FileUploader({
					url: URL+id+"/files/"
				});
				this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
					this.model.files.push(JSON.parse(response));
				};


				this.betsService.getBet(id)
				.subscribe((bet: Bet) => this.model = bet);
			}
		});

		this.usersService.getAll().subscribe((users: User[]) => this.users = users);
	}

	public hasBaseDropZoneOver:boolean = false;

	public fileOverBase(e:any):void {
		this.hasBaseDropZoneOver = e;
	}


	createBet() {
		if(this.model._id){
			this.betsService.updateBet(this.model)
			.subscribe(
			ad => console.log("ok"),
			error => this.errorMessage = <any>error);
		}else {
			this.betsService.addBet(this.model)
				.subscribe(
				ad => this.router.navigate(['/bet/'+ad._id]),
				error => this.errorMessage = <any>error);
		}
	}
	photoURL(url) {
      return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
   
}
