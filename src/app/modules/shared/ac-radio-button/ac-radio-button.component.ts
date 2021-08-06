import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ac-radio-button',
  templateUrl: './ac-radio-button.component.html',
  styleUrls: ['./ac-radio-button.component.scss']
})
export class AcRadioButtonComponent implements OnInit {

  @ViewChild('checkBox', { static: true }) checkBox: ElementRef;

  @Input() text: string;
  @Input() checked = false;
  @Input() boxType = 'circle'; // Can be circle or square
  @Input() error = false;

  @Output() checkTapped = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  layoutTapped() {
    this.checkBox.nativeElement.checked = !this.checkBox.nativeElement.checked;
    this.checked = !this.checked;
    this.checkTapped.emit(this.checked);
  }

  /**
   * Used on the parent view to uncheeck the radio button if its checked.
   * This is used if theres multiple radio buttons, but can only have one checked at a time.
   */
  unCheck() {
    if (this.checked) {
      this.checkBox.nativeElement.checked = !this.checkBox.nativeElement.checked;
      this.checked = false;
    }
  }
}
