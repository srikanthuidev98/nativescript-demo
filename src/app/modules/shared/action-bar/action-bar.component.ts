import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';

import { RouterHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'app-action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.scss']
})

export class ActionBarComponent {

    @Input() title: string;
    @Input() backBtnText: string = undefined;
    @Input() showCalendar = false;
    @Input() showPlus = false;
    @Input() showMessageBubble = false;
    @Input() titleColor = '#593c81';
    @Input() titleCanBeTapped = false;
    @Input() dialogOpen = false;

    @Output() calendarTapped = new EventEmitter();
    @Output() titleTapped = new EventEmitter();

    @Select(AppState.getUnreadMessages) unreadMessages$: Observable<number>;
    @Select(AppState.getMessagingEnabled) messagingEnabled$: Observable<boolean>;

    constructor(private routerHelper: RouterHelper) {}

    onDrawerButtonTap(): void {
        if (this.dialogOpen) {
            return;
        }
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onAndroidBack() {
        if (this.dialogOpen) {
            return;
        }
        this.routerHelper.backToPreviousPage();
    }

    onCalendarTap() {
        if (this.dialogOpen) {
            return;
        }
        this.calendarTapped.emit();
    }

    onMessageTap() {
        if (this.dialogOpen) {
            return;
        }
        this.routerHelper.navigate(['/messaging']);
    }

    onTitleTapped() {
        if (this.dialogOpen) {
            return;
        }
        if (this.titleCanBeTapped) {
            this.titleTapped.emit();
        }
    }
}
