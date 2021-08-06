import { Injectable } from '@angular/core';

import { SwissArmyKnife } from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';

/**
 * This helper is just to hold any other one off service that could be useful in many places.
 */
@Injectable({ providedIn: 'root' })
export class ToolsHelper {

    constructor() { }

    /**
     * Closes the keyboard.
     */
    closeKeyboard() {
        SwissArmyKnife.dismissSoftKeyboard();
    }
}
