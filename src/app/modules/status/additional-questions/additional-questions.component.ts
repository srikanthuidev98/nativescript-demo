import { Component, OnInit } from '@angular/core';
import { Question, Client, DualClient, DialogData, AddionialQuestionsStateObject } from '../../../../ACCommon/models';
import { DisplayType } from '../../../../ACCommon/enums';
import { RouterHelper, LoadingHelper } from '../../../../ACCommon/helpers';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'ns-additional-questions',
  templateUrl: './additional-questions.component.html',
  styleUrls: ['./additional-questions.component.scss']
})
export class AdditionalQuestionsComponent implements OnInit {

  @Select(AppState.getCurrentClient) client$: Observable<Client>;
  @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;

  @Emitter(AppState.sendAdditionalQuestions)
  public sendAdditionalQuestions: Emittable<AddionialQuestionsStateObject>;

  constructor(private routerHelper: RouterHelper, private route: ActivatedRoute, private loadingHelper: LoadingHelper) { }

  public title = 'COVID-19 Screening';
  public errorText = '';
  public dialogOpen = false;
  public cameFrom: string;
  public dialogData: DialogData = { title: 'Alert', message: '', color: '#e00720', cancelButtonText: 'Close'};

  questions: Question[] = [];

  ngOnInit() {
    this.cameFrom = this.route.snapshot.paramMap.get('from');
    this.client$.pipe(first()).subscribe(client => {
      this.dualClient$.pipe(first()).subscribe(dualClient => {
        if (!client && dualClient) {
          client = dualClient.c1;
        }

        if (this.cameFrom === 'checkin') {
          client.Questions.forEach(question => {
            if (question.displayType === DisplayType.CheckIn || question.displayType === DisplayType.Both) {
              question.answer = undefined;
              this.questions.push(question);
            }
          });

          // tslint:disable-next-line:max-line-length
          this.dialogData.message = 'You have replied that you have experienced a symptom(s) which has been identified as a potential risk factor for COVID-19. Please reach out to your agency, registry or client before proceeding to work.';
        } else {
          client.Questions.forEach(question => {
            if (question.displayType === DisplayType.CheckOut || question.displayType === DisplayType.Both) {
              question.answer = undefined;
              this.questions.push(question);
            }
          });

          // tslint:disable-next-line:max-line-length
          this.dialogData.message = 'You have replied that your client has experienced a symptom(s) which has been identified as a potential risk factor for COVID-19. Please reach out to your agency, registry, or client before returning to work.';
        }
      });
    });

    this.loadingHelper.hideIndicator();
  }

  continueTap() {
    this.errorText = '';

    if (this.verifyQuestions()) {
      let yesWasTapped = false;
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].answer === 'yes') {
          yesWasTapped = true;
          break;
        }
      }

      if (yesWasTapped) {
        this.dialogOpen = true;
      } else {
        this.client$.pipe(first()).subscribe(client => {
          this.sendAdditionalQuestions.emit({questions: this.questions, caregiverId: client.CaregiverId});
          this.navigate();
        });
      }
    } else {
      setTimeout(() => {
        this.errorText = 'Please answer all questions before continuing.';
      }, 50);
    }
  }

  private verifyQuestions(): boolean {
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].answer === null || this.questions[i].answer === undefined) {
        return false;
      }
    }

    return true;
  }

  closeDialog() {
    this.dialogOpen = false;
    setTimeout(() => {
      this.client$.pipe(first()).subscribe(client => {
        this.sendAdditionalQuestions.emit({questions: this.questions, caregiverId: client.CaregiverId});
        this.navigate();
      });
    }, 200);
  }

  private navigate() {
    if (this.cameFrom === 'checkin') {
      this.routerHelper.navigate(['/status/record-audio']);
    } else {
      this.routerHelper.navigate(['status/checkout-activities']);
    }
  }
}
