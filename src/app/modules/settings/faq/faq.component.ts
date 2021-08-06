import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  public questions = [];

  constructor() { }

  public dot = '\u2022';

  private placeholderText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
  'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit ' +
  'esse cillum dolore eu fugiat nulla pariatur.';

  ngOnInit() {
    this.questions = [
      { q: 'How do I view frequently asked questions for AssuriCare Caregiver?',
        a: 'Here! This feature will be coming soon!', show: false},
      // {q: 'How do I find and see my time entries that I entered for previous ' +
      // ' time periods and/or this current time period?', a: this.placeholderText, show: false},
      // {q: 'The AssuriCareforCaregivers Mobile App sent me a “Location Alert” message; ' +
      // 'what does this mean and what do I do about it? It will not let me check out or enter ' +
      // 'my time? (Is that correct? Will it prevent the user from anything else?)', a: this.placeholderText, show: false},
      // {q: 'I forgot to check out using the AssuriCareforCaregivers Mobile App or the ' +
      // 'telephony system. How do I check out now using the AssuriCareforCaregivers Mobile App?', a: this.placeholderText, show: false},
      // {q: 'I logged in AssuriCareforCaregivers Mobile App for the first time and received' +
      // ' an “Invalid Credentials” message; what does this mean and what do I do about it? ' +
      // 'I can’t finish logging into the system. (Is this correct?)', a: this.placeholderText, show: false},
      // {q: 'Are there other reference sources that can help me with AssuriCareforCaregivers ' +
      // 'Mobile App?', a: this.placeholderText, show: false},
      // {q: 'Get answers to some of our most frequently asked questions below', a: this.placeholderText, show: false},
      // {q: 'Get answers to some of our most frequently asked questions below', a: this.placeholderText, show: false},
      // {q: 'Get answers to some of our most frequently asked questions below', a: this.placeholderText, show: false},
      // {q: 'Get answers to some of our most frequently asked questions below', a: this.placeholderText, show: false},
      // {q: 'Get answers to some of our most frequently asked questions below', a: this.placeholderText, show: false}
    ];
  }

  extendTap(index: number) {
    this.questions[index].show = !this.questions[index].show;
  }

}
