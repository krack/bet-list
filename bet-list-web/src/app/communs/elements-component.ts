import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CrudService } from './crud-service.service';
import { IdentifiedElement } from './indentified-element';

import { ErrorComponent } from './errorComponent';




export class ElementComponent<T extends IdentifiedElement> extends ErrorComponent  implements OnInit {
  protected listOfElement: T[]
  protected element: T;
  protected crudService : CrudService<T>;

  constructor (serviceCrud: CrudService<T>, router:Router, private route: ActivatedRoute) {
    super(router);
    this.crudService = serviceCrud;
  }
  
  ngOnInit() { 
  }

  initElementFromUrlParameter() {
    this.route.params.subscribe((params: Params) => {
      let id = params['id']
      if(id){
        this.crudService.getById(id)
        .subscribe(
          (element: T) => this.element = element,
          error=> this.manageError(error)
          );
        }
    });
  }


  saveElement() {
    if(this.element._id){
      this.crudService.updateElement(this.element)
      .subscribe(
        element => console.log("ok"),
          error=> this.manageError(error)
        );
    }else {
      this.crudService.add(this.element)
      .subscribe(
        element => this.router.navigate(['/bet/'+element._id]),
        error=> this.manageError(error)
      );
    }
  }

  deleteElement(event) {
    this.crudService.deleteById(this.element._id)
    .subscribe(
      result => {
        let i = this.listOfElement.findIndex(el => el._id === this.element._id);
        this.listOfElement.splice(i, 1);
      }
    );
    event.preventDefault();
  }




}
