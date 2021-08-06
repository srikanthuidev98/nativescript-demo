import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ac-dropdown',
  templateUrl: './ac-dropdown.component.html',
  styleUrls: ['./ac-dropdown.component.scss']
})
export class AcDropdownComponent implements OnInit {

  /**
   * Label above the DropDown
   */
  @Input() questionText = '';

  /**
   * Makes the dropdown editable or not.
   */
  @Input() editable = true;

  /**
   * Hint is the label inside of the dropdown.
   */
  @Input() hint = '';

  /**
   * Dropdown data. should be a simple string array.
   */
  @Input() items = [];

  /**
   * If there needs to be a pre selected line. Send the index.
   */
  @Input() selectedIndex: number;

  /**
   * Turns the label red if true.
   */
  @Input() showError = false;

  /**
   * Outputs the index of the selected item in the items array.
   */
  @Output() itemSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  dropDownSelectedItem(args) {
    if (typeof args.newIndex === 'number') {
      this.itemSelected.emit(args.newIndex);
    }
  }

}
