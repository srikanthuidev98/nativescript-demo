import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Question } from '../../../../ACCommon/models';
import { SwitchHelper } from '../../../../ACCommon/helpers';
import { QuestionType } from '../../../../ACCommon/enums';
import { AcRadioButtonComponent } from '../ac-radio-button/ac-radio-button.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @ViewChild('radioYes', { static: false }) radioYes: AcRadioButtonComponent;
  @ViewChild('radioNo', { static: false }) radioNo: AcRadioButtonComponent;

  constructor(private switchHelper: SwitchHelper) { }

  @Input() question: Question = undefined;
  @Input() editable = true;

  public questionType = QuestionType;

  // YesNo and YesNoExtra
  public yesNoSelected = '';

  // Switch
  public switchOn = false;

  // Free text and YesNoExtra
  public startingText = '';

  // DropDown
  public dropDownItems: string[] = [];
  public selectedIndex: number;

  ngOnInit() {
      if (this.question.type === QuestionType.Switch && !this.question.answer) {
          this.question.answer = 'false';
          this.question.required = false;
      }

      if (this.question.dropDownList) {
          this.question.dropDownList.forEach(element => {
              this.dropDownItems.push(element.Value);
          });
      }

      // If the question has an answer, then populate that awnser. Used for verify Shift.
      if (this.question.answer) {
          switch (this.question.type) {
              case QuestionType.YesNo:
                    this.yesNoSelected = this.question.answer;
                    break;
              case QuestionType.YesNoYesExtra:
                    if (this.question.answer !== 'no') {
                        this.yesNoSelected = 'yes';
                        this.startingText = this.question.answer;
                    } else {
                        this.yesNoSelected = 'no';
                    }
                    break;
              case QuestionType.YesNoNoExtra:
                    if (this.question.answer !== 'yes') {
                        this.yesNoSelected = 'no';
                        this.startingText = this.question.answer;
                    } else {
                        this.yesNoSelected = 'yes';
                    }
                    break;
              case QuestionType.Switch:
                    this.switchOn = JSON.parse(this.question.answer);
                    break;
              case QuestionType.FreeText:
                    this.startingText = this.question.answer;
                    break;
              case QuestionType.DropDown:
                    for (let i = 0; i < this.question.dropDownList.length; i++) {
                        if (this.question.dropDownList[i].Key === +this.question.answer) {
                            this.selectedIndex = i;
                        }
                    }
                    break;
          }
      }
  }

  onCheckTapped(answer: 'yes' | 'no', args: boolean) {
    if (answer === this.question.answer) {
      if (answer === 'yes') {
        this.radioYes.unCheck();
      } else {
        this.radioNo.unCheck();
      }
      this.question.answer = undefined;
    } else if (answer === 'yes') {
      this.radioNo.unCheck();
      this.question.answer = 'yes';
    } else {
      this.radioYes.unCheck();
      this.question.answer = 'no';
    }
  }

  yesNoTap(answer: 'yes' | 'no') {
      this.yesNoSelected = answer;
      this.question.answer = answer;

      if (this.question.type === QuestionType.YesNoYesExtra && answer === 'yes') {
        this.question.answer = '';
      } else if (this.question.type === QuestionType.YesNoNoExtra && answer === 'no') {
        this.question.answer = '';
      }
      this.question.showError = false;
  }

  onCheckedChange(args: any) {
    this.switchHelper.switch(args);
    this.question.answer = args.object.checked;
    this.question.showError = false;
  }

  onTextChange(args: any) {
    this.question.answer = args.value;
    this.question.showError = false;
  }

  dropDownItemSelected(index: number) {
    this.question.answer = `${this.question.dropDownList[index].Key}`;
    this.question.showError = false;
  }
}
