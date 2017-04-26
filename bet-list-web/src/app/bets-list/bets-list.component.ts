import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';



import { Bet } from '../model/bet';
import { BetsService } from '../bets.service';

@Component({
  selector: 'bets-list',
  templateUrl: './bets-list.component.html',
  styleUrls: ['./bets-list.component.scss'],
  providers:  [BetsService]
})
export class BetsListComponent  implements OnInit {
  errorMessage: string;
  bets: Bet[];

  constructor (private betsService: BetsService, public router:Router) {}
  
  ngOnInit() { this.getBets(); }

   getBets() {
    this.betsService.getBets()
    .subscribe(
      bets => this.bets = bets,
      error =>  this.manageError(error)
     );
  }



  deleteBet(event, bet:Bet) {
    this.betsService.deleteBet(bet._id)
    .subscribe(
      result => this.bets = this.bets.filter(el => el._id != bet._id),
      error =>  this.manageError(error)
      );
    event.preventDefault();
  }



  manageError(status:String){
    if(status === '401'){
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/login']);

    }
  }


}
