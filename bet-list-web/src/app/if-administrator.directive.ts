import { Directive, ElementRef,OnInit } from '@angular/core';
import { User, UsersService } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';


@Directive({
  selector: '[IfAdministrator]'
})
export class IfAdministratorDirective  implements OnInit {

	constructor(private el: ElementRef, private usersService: UsersService) {
		this.el.nativeElement.style.display = "none";
	}
	ngOnInit() {
		this.usersService.getConnectedUser().subscribe(user =>{
			if(user && (user.administrator || user.owner)){
				this.el.nativeElement.style.display = "";
			}else{
				this.el.nativeElement.style.display = "none";
			}
		}); 
	} 

}
