import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import { FileUploader, FileSelectDirective} from 'ng2-file-upload'

import { Bet } from '../model/bet';
import { File } from '../model/file';
import { User } from '../model/user';
import { BetsService } from '../bets.service';
import { UserService } from '../users.service';

import {environment} from '../../environments/environment';

const URL =  environment.apiUrl+'bets/';

@Component({
  selector: 'bets-list-element',
  templateUrl: './bets-list-element.component.html',
  styleUrls: ['./bets-list-element.component.scss'],
  providers:  [BetsService, UserService, FileSelectDirective]
})
export class BetsListElementComponent implements OnInit {	
  public uploader:FileUploader;
  @Input() element: Bet;
  public winner:User;
  public looser:User;
  private connected:User;

  constructor(private service: BetsService, private usersService: UserService, private domSanitizer:DomSanitizer) { 
    this.winner = new User(); 
    this.looser = new User();
    this.connected = new User();
  }

  ngOnInit() {
  		this.uploader = new FileUploader({
		    url: URL+this.element._id+"/files/",
        autoUpload: true
	    });
	    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
		    this.element.files.push(JSON.parse(response));
	    };
      if(this.element.winneur){
        this.usersService.getById(this.element.winneur).subscribe((user: User) => this.winner = user);
      }
      if(this.element.looser){
        this.usersService.getById(this.element.looser).subscribe((user: User) => this.looser = user);
      }
      this.usersService.getConnectedUser().subscribe((user: User)=> this.connected = user);

  }

  photoURL(url) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  deleteElement(event) {
    this.service.deleteBet(this.element._id)
    .subscribe(
      result => console.log("t")
      );
    event.preventDefault();
  }

   deleteImage(event, file:File) {     

     this.service.deleteImage(this.element._id, file._id)
                       .subscribe(
                         result => this.element.files = this.element.files.filter(el => el._id != file._id));
      event.preventDefault();
  }

  accepteBet (){
    this.element.accepted = true;
    this.service.updateBet(this.element).subscribe(
                         result => this.element = result);
  }

}
