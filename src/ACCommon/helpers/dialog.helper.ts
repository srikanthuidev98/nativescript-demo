import { Injectable } from '@angular/core';
import { alert, action, ActionOptions, confirm } from 'tns-core-modules/ui/dialogs';
import { AppComponent } from '../../app/app.component';
import { Color } from 'tns-core-modules/color';
import { DialogData } from '../models';

/**
 * This DialogHelper is used to create alerts for both Mobile and Web.
 *
 * Please only use this Dialog helper when using any sort of alerts.
 */
@Injectable({ providedIn: 'root' })
export class DialogHelper {
    alert(message: string, title: string = 'Alert', okButtonText: string = 'OK', cancelable: boolean = true): Promise<void> {
        const options = {
            title: title,
            message: message,
            okButtonText: okButtonText,
            cancelable: cancelable
        };

        return alert(options);
    }

    confirmAlert(message: string, title: string = 'Alert',
                okButtonText: string = 'OK', cancelButtonText: string = 'Cancel'): Promise<boolean> {
        const options = {
            title: title,
            message: message,
            okButtonText: okButtonText,
            cancelButtonText:
            cancelButtonText
        };

        return confirm(options);
    }

    /**
     * Generic Action list dialog
     * @param options - All options (string)
     * @param title - title
     */
    genericActionDialog(options: string[], title: string): Promise<string> {
        const allOptions: ActionOptions = {
            title: title,
            actions: options,
            cancelButtonText: 'Cancel'
        };

        return action(allOptions);
    }

    /**
     * This is used to show the dialog action sheet for profile picture.
     *
     * @param showDeleteOption - send true if you want the 'Delete Picture' option to show.
     *
     * It will return one of these 4 strings:
     * 'Choose Picture' | 'Take Picture' | 'Delete Picture' | 'Cancel'
     */
    pictureActionDialog(showDeleteOption: boolean): Promise<string> {
        const options: ActionOptions = {
            cancelButtonText: 'Cancel'
        };

        if (showDeleteOption) {
            options.actions = ['Choose Picture', 'Take Picture', 'Delete Picture'];
        } else {
            options.actions = ['Choose Picture', 'Take Picture'];
        }

        return action(options);
    }

    activitiesActionDialog(adlString: string): Promise<string> {
        const options: ActionOptions = {
            cancelButtonText: 'Cancel'
        };

        if (adlString === 'Supervision') {
            options.actions = ['Provided', 'Did not provide'];
        } else {
            options.actions = ['Hands-On assistance', 'Standby assistance', 'Did not provide'];
        }

        return action(options);
    }
}
