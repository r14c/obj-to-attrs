/**
 * Copyright (c) 2004 callumacrae
 * Copyright (c) 2024 r14c
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export { objToAttrs }

import merge from 'lodash/merge'

interface ObjToAttrsOptions {
  quote?: string
  assignment?: string
  separator?: string
}
type HelperFn = (value: any) => any

let helpers: Record<string, Function> = {};

/**
 * Adds a helper for a certain attribute.
 *
 * @param {string} name Name of the attribute to call the helper on.
 * @param {function} helper The helper function, which should return either an
 *              object to be turning into a string or a string.
 * @returns {objToAttrs} Returns itself to allow method chaining.
 */
objToAttrs.addHelper = function (name: string, helper: HelperFn) {
  helpers[name] = helper;
  return this;
};

/**
 * Removes a helper for a certain attribute.
 *
 * @param {string} name Name of the attribute to remove the helper for.
 * @returns {objToAttrs} Returns itself to allow method chaining.
 */
objToAttrs.removeHelper = function (name: string) {
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
function objToAttrs(object: any, options: ObjToAttrsOptions = {}): string {
  const boolean = [ 'checked', 'compact', 'declare', 'defer', 'disabled', 'ismap',
    'multiple', 'nohref', 'noresize', 'noshade', 'nowrap', 'readonly', 'selected' ]
  options = merge({}, {
    assignment: '=',
    quote: '"',
    separator: ' '
  }, options)
  let result = []
  for (let [ argument, value ] of Object.entries(object || {})) {
    if (value === null) {
      // we'll take this as a sign that the attr should be omitted
      continue
    } else {
      // If a helper is available, use that
      if (typeof helpers[argument] === 'function') {
        const helped = helpers[argument](value)
        return (typeof helped === 'object') ? objToAttrs(helped, options) : helped
      }

      // Turn dataTest into data-test
      argument = argument.replace(/[A-Z]/g, function (letter) {
        return '-' + letter.toLowerCase()
      });

      // If it's a boolean attribute, we don't need =""
      if (boolean.includes(argument)) {
        return argument
      }

      // argument="value"
      const quote = options.quote

      if (typeof value === 'string') {
        value = value.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }
      result.push(argument + options.assignment + quote + value + quote)
    }
  }
  return result.join(options.separator)
}

// A default helper to turn `data: { foo: 'bar' }` into `data-foo="bar"`
objToAttrs.addHelper('data', (argument) => {
  let newObject: Record<string, any> = {}
  Object.entries(argument).forEach(([ name, value ]) => {
    newObject['data-' + name] = value
  })
  return newObject
})

