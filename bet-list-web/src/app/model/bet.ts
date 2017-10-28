import { File } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';
import { IdentifiedElement } from 'angularjs-nodejs-framework/angularjs-nodejs-framework';

export class Bet implements IdentifiedElement{

	public accepted:boolean;
	public files:File[];
	constructor(public _id: string, public title?: String, public status?: String, public victoriesConditions?: String, public issues?: String, public winneur?: String, public looser?: String
		, public applicant?: String, public acceptor?: String, public applicantBet?:String, public acceptorBet?:String){
		this.files = [];
	}

}