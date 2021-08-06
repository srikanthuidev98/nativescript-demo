"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used to compare two clients to see if they are the same.
 */
function compareClients(c1, c2) {
    if (c1 && c2) {
        if (c1.Id === c2.Id && c1.CaregiverId === c2.CaregiverId) {
            return true;
        }
    }
    return false;
}
exports.compareClients = compareClients;
