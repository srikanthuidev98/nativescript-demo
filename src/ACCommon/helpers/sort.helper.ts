
let _variable = '';
let _reverse: boolean;

/**
 * Custom sorting for array of Objects.
 * The function updates the array that is passed, so you do not need to assign a new array to this function.
 *
 * @param array - The actual array of objects
 * @param variable - the string name of the variable you want to sort by. EX: 'Name'
 * @param reverse - Defaults to false. If true, reverses the order of the array.
 */
export function customSort<T>(array: T[], variable: string, reverse: boolean = false): T[] {
    if (!array) {
        return [];
    }

    _variable = variable;
    _reverse = reverse;

    array.sort(compare);

    return array;
}


function compare(a: any, b: any) {
    if (!a[_variable]) {
        return 0;
    }

    const objectA = a[_variable];
    const objectB = b[_variable];

    let comparison = 0;
    if (objectA > objectB) {
        _reverse ? comparison = -1 : comparison = 1;
    } else if (objectA < objectB) {
        _reverse ? comparison = 1 : comparison = -1;
    }
    return comparison;
}
