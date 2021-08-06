"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _variable = '';
var _reverse;
/**
 * Custom sorting for array of Objects.
 * The function updates the array that is passed, so you do not need to assign a new array to this function.
 *
 * @param array - The actual array of objects
 * @param variable - the string name of the variable you want to sort by. EX: 'Name'
 * @param reverse - Defaults to false. If true, reverses the order of the array.
 */
function customSort(array, variable, reverse) {
    if (reverse === void 0) { reverse = false; }
    _variable = variable;
    _reverse = reverse;
    array.sort(compare);
    return array;
}
exports.customSort = customSort;
function compare(a, b) {
    if (!a[_variable]) {
        return 0;
    }
    var objectA = a[_variable];
    var objectB = b[_variable];
    var comparison = 0;
    if (objectA > objectB) {
        _reverse ? comparison = -1 : comparison = 1;
    }
    else if (objectA < objectB) {
        _reverse ? comparison = 1 : comparison = -1;
    }
    return comparison;
}
