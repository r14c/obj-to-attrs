"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToAttrs = void 0;
const merge_1 = __importDefault(require("lodash/merge"));
let helpers = {};
/**
 * Adds a helper for a certain attribute.
 *
 * @param {string} name Name of the attribute to call the helper on.
 * @param {function} helper The helper function, which should return either an
 *              object to be turning into a string or a string.
 * @returns {objToAttrs} Returns itself to allow method chaining.
 */
objToAttrs.addHelper = function (name, helper) {
    helpers[name] = helper;
    return this;
};
/**
 * Removes a helper for a certain attribute.
 *
 * @param {string} name Name of the attribute to remove the helper for.
 * @returns {objToAttrs} Returns itself to allow method chaining.
 */
objToAttrs.removeHelper = function (name) {
    delete helpers[name];
    return this;
};
/**
 * Turns a JavaScript object into a string containing HTML attributes.
 *
 * @param {object} object The object to turn into attributes.
 * @param {object} options Allows you to configure stuff. See README or code.
 * @returns {string} Returns an HTML attribute string!
 */
function objToAttrs(object, options = {}) {
    const boolean = ['checked', 'compact', 'declare', 'defer', 'disabled', 'ismap',
        'multiple', 'nohref', 'noresize', 'noshade', 'nowrap', 'readonly', 'selected'];
    options = (0, merge_1.default)({}, {
        assignment: '=',
        quote: '"',
        separator: ' '
    }, options);
    const result = Object.entries(object || {}).map(([argument, value]) => {
        // If a helper is available, use that
        if (typeof helpers[argument] === 'function') {
            const helped = helpers[argument](value);
            return (typeof helped === 'object') ? objToAttrs(helped, options) : helped;
        }
        // Turn dataTest into data-test
        argument = argument.replace(/[A-Z]/g, (letter) => {
            return '-' + letter.toLowerCase();
        });
        // If it's a boolean attribute, we don't need =""
        if (boolean.includes(argument)) {
            return argument;
        }
        // argument="value"
        const quote = options.quote;
        if (typeof value === 'string') {
            value = value.replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
        return argument + options.assignment + quote + value + quote;
    });
    return result.join(options.separator);
}
exports.objToAttrs = objToAttrs;
// A default helper to turn `data: { foo: 'bar' }` into `data-foo="bar"`
objToAttrs.addHelper('data', (argument) => {
    let newObject = {};
    Object.entries(argument).forEach(([name, value]) => {
        newObject['data-' + name] = value;
    });
    return newObject;
});
//# sourceMappingURL=index.js.map