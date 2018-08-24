import { Component, Provider, forwardRef, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'angularjs-nodejs-framework/client/services/user';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';




export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => SelectUserComponent),
	multi: true
};

@Component({
	moduleId: module.id,
	selector: 'select-user',
	templateUrl: './select-user.component.html',
	styleUrls: ['./select-user.component.scss'],
	providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]

})
export class SelectUserComponent implements OnInit, ControlValueAccessor {

	@Input()
	private users: User[] = [];


	constructor(private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {
	}

	private select(user: User): void {
		this.value = user._id;
	}

	// The internal data model
	private innerValue: any = '';

	// Placeholders for the callbacks which are later providesd
	// by the Control Value Accessor
	private onTouchedCallback: () => void = null;
	private onChangeCallback: (_: any) => void = null;

	//get accessor
	get value(): any {
		return this.innerValue;
	};

	// set accessor including call the onchange callback
	set value(v: any) {
		if (v !== this.innerValue) {
			this.innerValue = v;
			this.onChangeCallback(v);
		}
	}


	//Set touched on blur
	onBlur() {
		this.onTouchedCallback();
	}

	//From ControlValueAccessor interface
	writeValue(value: any) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
	}

	//From ControlValueAccessor interface
	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	//From ControlValueAccessor interface
	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}
}
