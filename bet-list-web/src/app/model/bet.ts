import { File } from '../communs/file';
import { IdentifiedElement } from '../communs/indentified-element';

export class Bet implements IdentifiedElement{

	public accepted:boolean;
	public files:File[];
	constructor(public _id: string, public title?: String, public issues?: String, public winneur?: String, public looser?: String){
		this.files = [];
	}

}