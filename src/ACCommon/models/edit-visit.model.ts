import { Visit } from '.';

export interface EditVisit {
    Identifier: 'old' | 'new';
    Visit: Visit;
}

/**
 * Creates a Edit visit object.
 * - First element:   Initial visit. **DO NOT CHANGE THIS VISIT**
 * - Second element:  New visit. ONLY change this one during the edit visit workflow.
 *
 * @param visit - Visit that will be updating.
 */
export function createInitialEditVisit(visit: Visit): EditVisit[] {
    const editVisits: EditVisit[] = [];

    editVisits.push({
        Identifier: 'old',
        Visit: visit
    });

    const newVisit = JSON.parse(JSON.stringify(visit)); // Creates new visit with no connection to old visit.

    newVisit.CISourceId = 300;

    editVisits.push({
        Identifier: 'new',
        Visit: newVisit
    });

    return editVisits;
}
