import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ac-textfield',
  templateUrl: './ac-textfield.component.html',
  styleUrls: ['./ac-textfield.component.scss']
})
export class AcTextfieldComponent implements OnInit {

  @Input() type: 'email' | 'password' | 'general' = 'general'; // Types of TextFields. Defaults to General.
  @Input() text = '';
  @Input() initalText = '';
  @Input() initalPasswordText = '';

  @Output() valueChanged = new EventEmitter();

  public input = '';
  public floatHint = false;
  public showPassword = false;
  public borderColor = '#d8d8d8';
  public showPasswordText = 'Show';

  constructor() { }

  ngOnInit() {
    if (this.initalText || this.initalPasswordText) {
      this.floatHint = true;
    }
   }

  onFocus() {
    this.borderColor = '#593c81';
  }

  onBlur() {
    this.borderColor = '#d8d8d8';
  }

  passwordToggle() {
    if (this.showPasswordText === 'Show') {
      this.showPassword = true;
      this.showPasswordText = 'Hide';
    } else {
      this.showPassword = false;
      this.showPasswordText = 'Show';
    }
  }

  onTextChange(args: any) {
    this.valueChanged.emit(args.value);
    if (args.value.length > 0) {
      this.floatHint = true;
    } else {
      this.floatHint = false;
    }
  }
}
