import { Injectable } from '@angular/core';

import { FingerprintAuth, BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';
import { DialogHelper } from '../helpers';
import { AppState } from '../states';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Caregiver } from '../models';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { LocalStorageService } from '../storage/local-storage';
import { isIOS } from 'tns-core-modules/ui/page/page';

@Injectable()
export class FingerprintService {

    @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;


    @Emitter(AppState.fingerprintLogin)
    public fingerprintLogin: Emittable<null>;

    private fingerprintAuth: FingerprintAuth;
    private fingerprintString = '';

    constructor(private dialogHelper: DialogHelper) {
        this.fingerprintAuth = new FingerprintAuth();

        this.fingerprintStringType().then(type => {
            this.fingerprintString = type;
        });
    }

    available(): Promise<'touch' | 'face'> {
        return this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
            console.log(`Biometric ID available1? ${result.any}`);
            console.log(`Touch? ${result.touch}`);
            console.log(`Face? ${result.face}`);

            if (result.touch) {
                return 'touch';
            } else if (result.face) {
                return 'face';
            }

            return undefined;
        });
    }

    fingerprintStringType(): Promise<string> {
        return this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
            let type = 'Fingerprint';

            if (isIOS) {
                type = 'Touch ID';
            } else {
                type = 'Fingerprint';
            }

            if (result.face) {
                type = 'Face ID';
            }

            return type;
        });
    }

    isFingerprintEnabled(): boolean {
        const data = LocalStorageService.getFingerprintData();

        if (data && data.Name !== 'temp') {
            return true;
        } else {
            return false;
        }
    }

    loginFingerprintSetup(): Promise<void> {
        return this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
            if (result.any) {
                return this.fingerprintAuth.verifyFingerprint({
                      message: `Set up ${this.fingerprintString}`, // title
                      authenticationValidityDuration: 10, // optional (used on Android, default 5)
                      useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                    })
                    .then(() => {
                        const caregiverTemp: Caregiver = {
                            Name: 'temp',
                            Token: 'temp',
                            APIToken: 'temp',
                            Expires: undefined,
                            RefreshToken: 'temp',
                            Id: 0
                        };
                        LocalStorageService.setFingerprintData(caregiverTemp); // Creating temp caregiver
                    })
                    .catch((err) => {
                        this.dialogHelper.alert(`${this.fingerprintString} not recognised, please try again`, 'Fail', 'Close');
                        console.log(`Biometric ID NOT OK: ${JSON.stringify(err)}`);
                        throw `${this.fingerprintString} not recognised`;
                });
            } else {
                this.showNoFingerprintDialog();
            }
        });
    }

    setUpFingerprint(): Promise<void> {
        return this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
            if (result.any) {
                return this.fingerprintAuth.verifyFingerprint({
                      message: `Set up ${this.fingerprintString}`, // title
                      authenticationValidityDuration: 10, // optional (used on Android, default 5)
                      useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                    })
                    .then(() => {
                        this.caregiver$.pipe(first()).subscribe(caregiver => {
                            LocalStorageService.setFingerprintData(caregiver);
                            // this.updateFingerprintData.emit(caregiver);
                            this.dialogHelper.alert(`${this.fingerprintString} enabled!`, 'Success!', 'Close');
                            Promise.resolve();
                        });
                    })
                    .catch((err) => {
                        this.dialogHelper.alert(`${this.fingerprintString} not recognised, please try again`, 'Fail', 'Close');
                        console.log(`Biometric ID NOT OK: ${JSON.stringify(err)}`);
                        throw 'Fingerprint not recognised';
                });
            } else {
                this.showNoFingerprintDialog();
            }
        });
    }

    showNoFingerprintDialog() {
        let timeout = 0;
        if (isIOS) { // iOS needs a timeout because of the animation with the modal is blocking the alert from appearing.
            timeout = 600;
        }

        setTimeout(() => {
            this.dialogHelper.alert(`It looks like there is no ${this.fingerprintString} saved on this device.` +
                    `Please go to your device Settings > Security and enroll your ${this.fingerprintString}`,
                    `No ${this.fingerprintString} Found`, 'Close');
        }, timeout);
        throw 'No fingerprints';
    }

    removeFingerprint() {
        LocalStorageService.setFingerprintData(null);
    }

    verifyFingerprint() {
        this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
            if (!result) {
                return;
            }

            this.fingerprintAuth.didFingerprintDatabaseChange().then(changed => {
                if (changed) { // Fingerprint has changed on iOS, need to re-authenticate user
                    this.removeFingerprint();
                    this.dialogHelper.alert('Please re-login using your email and password.',
                                            `${this.fingerprintString} data has changed`, 'Close');
                } else {
                    let message = '';

                    if (result.face) {
                        message = 'Use Face ID to continue.';
                    } else {
                        message = `Place your finger on your device\'s ${this.fingerprintString} sensor to continue`;
                    }

                    this.fingerprintAuth.verifyFingerprint({
                            message: message, // title
                            authenticationValidityDuration: 10, // optional (used on Android, default 5)
                            useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                        })
                        .then(() => {
                            this.fingerprintLogin.emit(null);
                        })
                        .catch((err) => {
                            this.dialogHelper.alert('Please re-login using your email and password.',
                                                    `${this.fingerprintString} not recognised`, 'Close');
                            console.log(`Biometric ID NOT OK: ${JSON.stringify(err)}`);
                    });
                }
            });
        });
    }
}
