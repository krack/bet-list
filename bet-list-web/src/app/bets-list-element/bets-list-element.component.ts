import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Bet } from '../model/bet';
import { File, ElementComponent, User, UsersService } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';
import { BetsService } from '../bets.service';

import {environment} from '../../environments/environment';

const URL =  environment.apiUrl+'bets/';

@Component({
  selector: 'bets-list-element',
  templateUrl: './bets-list-element.component.html',
  styleUrls: ['./bets-list-element.component.scss'],
  providers:  [BetsService, UsersService]
})
export class BetsListElementComponent extends ElementComponent<Bet> implements OnInit {
  private usersService:UsersService;	

  @Input() element: Bet;
  @Input()  elements: Bet[];

  private endpoint:string;
  public winner:User;
  public looser:User;
  private connected:User;

  constructor(service: BetsService, usersService: UsersService, router:Router, route: ActivatedRoute) { 
    super("/bets/", service, router, route);
    this.usersService = usersService;
    this.winner = new User(undefined); 
    this.looser = new User(undefined);
    this.connected = new User(undefined);
  }

  ngOnInit() {
      this.listOfElement =this.elements;
      this.endpoint = URL+this.element._id+"/files/";

      if(this.element.winneur){
        this.usersService.getById(this.element.winneur).subscribe((user: User) => this.winner = user);
      }
      if(this.element.looser){
        this.usersService.getById(this.element.looser).subscribe((user: User) => this.looser = user);
      }
      this.usersService.getConnectedUser().subscribe((user: User)=> this.connected = user);

  }
  

  accepteBet (){
    this.element.accepted = true;
    this.crudService.updateElement(this.element).subscribe(
                         result => this.element = result);
  }

}
