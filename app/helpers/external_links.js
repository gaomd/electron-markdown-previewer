// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>

(function () {
    'use strict';

    var shell = require('electron').shell;

    var supportExternalLinks = function (e) {
        var href;

        var checkDomElement = function (element) {
            if (element.nodeName === 'A') {
                href = element.getAttribute('href');
            }

            // TODO: open local file
            if (href && href.match(/^https?:\/\//)) {
                shell.openExternal(href);
                e.preventDefault();
            } else if (element.parentElement) {
                checkDomElement(element.parentElement);
            } else {
                // open nothing instead of blank
                // TODO: what causes blank page?
                e.preventDefault();
            }
        }

        checkDomElement(e.target);
    }

    document.addEventListener('click', supportExternalLinks, false);
}());
