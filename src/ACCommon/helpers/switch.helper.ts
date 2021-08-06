import { Injectable } from '@angular/core';

import { Switch } from 'tns-core-modules/ui/switch';
import { EventData } from 'tns-core-modules/data/observable';
import { Color } from 'tns-core-modules/color/color';
import { isAndroid } from 'tns-core-modules/ui/page/page';

@Injectable({ providedIn: 'root' })
export class SwitchHelper {

    constructor() { }

    switch(args: EventData): boolean {
        const mySwitch = args.object as Switch;

        if (isAndroid) { // Changes the default behavior for Android. Turns the 'on' color to the same color as iOS.
            if (mySwitch.checked) {
                mySwitch.color = new Color('#76D572');
                mySwitch.backgroundColor = new Color('#76D572');
            } else {
                setTimeout(() => { // Using setTimeout so the color doesn't revert and blink blue on Android.
                    mySwitch.color = undefined;
                    mySwitch.backgroundColor = undefined;
                }, 100);
            }
        } else {
            mySwitch.backgroundColor = new Color('#76D572');
        }

        return mySwitch.checked;
     }
}
