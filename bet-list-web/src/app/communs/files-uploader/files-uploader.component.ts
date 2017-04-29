import { Component, Input, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';
import {DomSanitizer} from '@angular/platform-browser';
import { UUID } from 'angular2-uuid'
import { FileUploader, FileSelectDirective} from 'ng2-file-upload'

import {File} from '../file'

@Component({
  selector: 'files-uploader',
  templateUrl: './files-uploader.component.html',
  styleUrls: ['./files-uploader.component.scss'],
  providers:  [FileSelectDirective]
})
export class FilesUploaderComponent implements OnInit {

  @Input() list: File[];
  @Input() endpoint:string;
  @Input() readonly: boolean;

  private uploader:FileUploader;
  private uuid ;
  protected options:RequestOptions;

  constructor(private http:Http, private domSanitizer:DomSanitizer) { 
  	this.uuid= UUID.UUID()
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }

  ngOnInit() {
	this.uploader = new FileUploader({
		url: this.endpoint,
		autoUpload: true
	});
	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
		this.list.push(JSON.parse(response));
	};
  }

   deleteFile(event, file:File) {     
	this.http.delete(this.endpoint+file._id, this.options)
		.subscribe(
            result => {
            	let i = this.list.findIndex(el => el._id === file._id);
          		this.list.splice(i, 1);
            }
         );
      event.preventDefault();
  }

  private photoURL(url) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }


}
