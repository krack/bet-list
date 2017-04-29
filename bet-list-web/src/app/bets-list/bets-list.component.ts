import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { ListElements } from '../communs/list-elements';

import { Bet } from '../model/bet';
import { BetsService } from '../bets.service';

@Component({
  selector: 'bets-list',
  templateUrl: './bets-list.component.html',
  styleUrls: ['./bets-list.component.scss'],
  providers:  [BetsService]
})
export class BetsListComponent  extends ListElements<Bet> {

  constructor (betsService: BetsService, router:Router) {
    super(betsService, router);
  }

}
