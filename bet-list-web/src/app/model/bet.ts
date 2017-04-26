import { File } from './file';

export class Bet {

	public accepted:boolean;
	public files:File[];

	constructor(public _id?: String, public title?: String, public issues?: String, public winneur?: String, public looser?: String){
		this.files = [];
	}

}