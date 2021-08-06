export interface IADL {
    Key: string;
    Title: string;
    Type?: number;
    Order?: number;
    Value: number; // Used only within Apex
    Hide?: boolean; // Used only within Apex
}


export function createDefaultIADLs(iadls: IADL[]): { string: string, dictionary: any} {
    const result = { string: '', dictionary: {} };

    for (let i = 0; i < iadls.length; i++) {
        if (i !== 0) {
            result.string += '|';
        }
        result.string += `${iadls[i].Key}::0`;

        result.dictionary[iadls[i].Key] = 0;
    }

    return result;
}
