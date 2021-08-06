import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

    constructor() { }

    /**
     * Checks to see if string is a valid email.
     *
     * Returns true if email is valid.
     */
    validateEmail(email: string) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks to see if string is a valid password.
     *
     * Returns true if password is valid.
     */
    validatePassword(pass: string) {
        if (pass.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Checks to see if string is a valid new password.
     * Checks on 3 varibles:
     *
     * 1. length       - At least 8 characters long
     * 2. letters      - Must contain a lower and upper case letter.
     * 3. numberSymbol - Must contain a number and symbol.
     *
     * Returns an object with 3 booleans: { length: boolean, letters: boolean, numberSymbol: boolean } for the above 3 options.
     */
    validateNewPassword(pass: string): { length: boolean, letters: boolean, numberSymbol: boolean } {
        const result = { length: false, letters: false, numberSymbol: false };

        if (pass.length >= 8) {
            result.length = true;
        }

        if (/[A-Z]+/.test(pass) && /[a-z]+/.test(pass)) {
            result.letters = true;
        }

        if (/[\d]/.test(pass) && /[-!$%^&*()_+|~={}[:;<>?,.@#\]]/g.test(pass)) {
            result.numberSymbol = true;
        }

        return result;
    }
}
