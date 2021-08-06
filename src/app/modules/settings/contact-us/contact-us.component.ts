import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RouterHelper, RedirectHelper } from '../../../../ACCommon/helpers';
import { isIOS } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private redirectHelper: RedirectHelper, private route: ActivatedRoute, private routerHelper: RouterHelper) { }

  public from = '';
  public title = 'Contact Us';

  ngOnInit() {
    this.from = this.route.snapshot.paramMap.get('from'); // Grabs route parameter

    if (this.from) {
      this.title = 'Customer Support';
    }
  }

  faqTap() {
    this.routerHelper.navigate(['settings/faq']);
  }

  phoneTap() {
    this.redirectHelper.call('1-844-277-8742');
  }

  emailTap() {
    let subject = '';

    if (isIOS) {
        subject = 'App Issue - iOS';
    } else {
        subject = 'App Issue - Android';
    }

    this.redirectHelper.email('logsheets@assuricare.com', subject);
  }

}
