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
  public applicant:User;
  public acceptor:User;
  private connected:User;

  constructor(service: BetsService, usersService: UsersService, router:Router, route: ActivatedRoute) { 
    super("/bets/", service, router, route);
    this.usersService = usersService;
    this.winner = new User(undefined); 
    this.looser = new User(undefined);
    this.applicant = new User(undefined); 
    this.acceptor = new User(undefined);
    this.connected = new User(undefined);
  }

  ngOnInit() {
      this.listOfElement =this.elements;
      this.endpoint = URL+this.element._id+"/files/";

      if(this.element.applicant){
        this.usersService.getById(this.element.applicant).subscribe((user: User) =>{
          this.applicant = user
          if(this.element.winneur === this.element.applicant){
            this.winner = this.applicant;
          }else{
            this.looser = this.applicant;
          }
        });
      }
      if(this.element.acceptor){
        this.usersService.getById(this.element.acceptor).subscribe((user: User) =>{
          this.acceptor = user
          if(this.element.winneur === this.element.acceptor){
            this.winner = this.acceptor;
          }else{
            this.looser = this.acceptor;
          }
        });
      }
      this.usersService.getConnectedUser().subscribe((user: User)=> this.connected = user);

  }
  
  acceptBet (){
    this.element.status = 'accepted';
    this.crudService.updateElement(this.element).subscribe(result => this.element = result);
  }

  rejectBet (){
    this.element.status = 'rejected';
    this.crudService.updateElement(this.element).subscribe(result => this.element = result);
  }

  iWin (){
    this.element.status = 'played';
    this.element.winneur = this.connected._id;
    this.crudService.updateElement(this.element).subscribe(result => this.element = result);
  }

  iLoose (){
    this.element.status = 'played';
    this.element.winneur = (this.connected._id===this.element.applicant)?this.element.acceptor:this.element.applicant;
    this.crudService.updateElement(this.element).subscribe(result => this.element = result);
  }

  acquitteBet (){
    this.element.status = 'acquitted';
    this.crudService.updateElement(this.element).subscribe(result => this.element = result);
  }

}
