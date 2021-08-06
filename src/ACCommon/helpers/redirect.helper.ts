import { Injectable } from '@angular/core';
import { isAndroid, isIOS } from 'tns-core-modules/ui/page/page';
import { ApiHelperService } from '../services/data/api-helper.service';
import { getAppId } from 'nativescript-appversion';
import { DialogHelper } from './dialog.helper';
import { openUrl } from 'tns-core-modules/utils/utils';
import { requestCallPermission, dial } from 'nativescript-phone';
import { compose, ComposeOptions, available } from 'nativescript-email';

import * as app from 'tns-core-modules/application';
import * as appavailability from 'nativescript-appavailability';

declare var android: any;

/**
 * Used to let the user navigate outside of the app for Android and iOS.
 */
@Injectable({ providedIn: 'root' })
export class RedirectHelper {

    constructor(private dialogHelper: DialogHelper) { }

    /**
     * Will open phone with the passed in phone number
     */
    public call(phoneNumber: string) {
        requestCallPermission('You should accept the permission to be able to make a direct phone call.')
            .then(() => {
                dial(phoneNumber, false);
            })
            .catch(() => {
                dial(phoneNumber, true);
            });
     }

     /**
     * Will open email with the passed in email and subject
     */
     public email(emailAddress: string, subject: string) {
        available().then((avail: boolean) => {
            if (avail) {
                const options: ComposeOptions = {
                    subject: subject,
                    to: [emailAddress]
                };

                compose(options);
            } else {
                this.dialogHelper.alert(`Please send an email to ${emailAddress}`, 'Email not set up on device.');
            }
        });
    }

    /**
     * Will navigate to the permissions.
     */
    public goToAppPermissions() {
        if (isAndroid) {
            getAppId().then(packageName => {
                const intent = new android.content.Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                const uri = android.net.Uri.fromParts('package', packageName, null);
                intent.setData(uri);
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY);
                app.android.foregroundActivity.startActivity(intent);
            });
        } else {
            openUrl('App-prefs:root=General');
        }
    }


    public goToAppStorePage() {
        if (isAndroid) {
            const uri = android.net.Uri.parse('market://details?id=' + 'com.assuricare.caregiver.android');
            const myAppLinkToMarket = new android.content.Intent(android.content.Intent.ACTION_VIEW, uri);
            app.android.foregroundActivity.startActivity(myAppLinkToMarket);
        } else {
            const appStore = 'itms-apps://itunes.apple.com/en/app/id' + '1481355056';
            openUrl(appStore);
        }
    }

    /**
     * Will open url to the Privacy Policy Webpage
     */
    public openPrivacyPolicyWebpage() {
        openUrl(ApiHelperService.privacyPolicyUrl);
    }

    /**
     * Will open url to the Terms of use Webpage
     */
    public openTermsOfUseWebpage() {
        openUrl(ApiHelperService.termsAndConditionsUrl);
    }

    public openMap(address: string) { // TODO
        // let loops = 0;

        // if (isIOS) {
        //     loops = 3; // Maps, Google Maps, Waze
        // } else {
        //     loops = 2; // Google Maps, Waze
        // }

        // // examples of what to pass:
        // // - for iOS: "maps://", "twitter://", "fb://"
        // // - for Android: "com.facebook.katana"
        // appavailability.available('com.twitter.android').then((avail: boolean) => {
        //     console.log('App available? ' + avail);
        // });


        if (isIOS) {
            openUrl('http://maps.apple.com/?daddr=' + encodeURIComponent(address));
        } else {
            openUrl('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address));
        }
    }
}
