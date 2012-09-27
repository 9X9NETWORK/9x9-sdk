/**
 * categories.js
 */

//////// Compatible with front-end ////////
if (typeof require == 'function') {
    if (typeof $ == 'undefined') {
        var $ = require('jquery');
    }
    eval(require('fs').readFileSync('../nn-sdk.js', 'utf8'));
}
if (typeof $ == 'undefined' || typeof nn == 'undefined') {
    console.error('nothing loaded!');
    return;
}
///////////////////////////////////////////

nn.api('GET', 'http://dev.teltel.com:8080/api/categories');

