/**
 * categories.js
 */

var $ = require('jquery');

eval(require('fs').readFileSync('nn-sdk.js', 'utf8'));

nn.api('GET', 'http://dev.teltel.com:8080/api/categories');

