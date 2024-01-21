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
export { objToAttrs };
interface ObjToAttrsOptions {
    quote?: string;
    assignment?: string;
    separator?: string;
}
type HelperFn = (value: any) => any;
/**
 * Turns a JavaScript object into a string containing HTML attributes.
 *
 * @param {object} object The object to turn into attributes.
 * @param {object} options Allows you to configure stuff. See README or code.
 * @returns {string} Returns an HTML attribute string!
 */
declare function objToAttrs(object: any, options?: ObjToAttrsOptions): string;
declare namespace objToAttrs {
    var addHelper: (name: string, helper: HelperFn) => typeof objToAttrs;
    var removeHelper: (name: string) => typeof objToAttrs;
}
