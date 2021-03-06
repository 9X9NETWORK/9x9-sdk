/**
 * 9x9 SDK (nn-sdk.js)
 *
 * 9x9 SDK is part of 9x9 development infrastructure.
 * As a tool kit, 9x9 SDK provides common front-end ultilization tools.
 *
 * Please refer to http://dev.teltel.com/9x9-sdk/ for usage
 * and more information.
 *
 * ChangeLog:
 *
 *   http://dev.teltel.com/9x9-sdk/ChangeLog.txt
 *
 * The latest release:
 *
 *   http://dev.teltel.com/9x9-sdk/js/release/latest/nn-sdk.js
 *
 * The latest development:
 *
 *   http://dev.teltel.com/9x9-sdk/js/nn-sdk.js
 *
 * @author Louis Jeng <louis.jeng@9x9.tv>
 */

var nn = { };

(function(nn) {

    nn.initialize = function(callback) {

        // NOTE: 'this' is denote 'nn' object itself, but not always does.

        var _init = function() {

            if (typeof $ == 'undefined') {

                nn.log('nn: jQuery is still missing!', 'error');
                return _dfd.reject();
            }
            nn.log('nn: jQuery is detected ' + $().jquery, 'debug');

            var _dfd = $.Deferred();
            var promise = _dfd.promise();
            if (typeof callback == 'function') {

                promise.done(callback);
            }
            $(function() {
                nn.log('nn: initialized', 'debug');
                _dfd.resolve($);
            });
            return promise;
        };

        if (typeof $ != 'undefined') {
            return _init();
        }
        nn.log('nn: jQuery is missing, but we can load it automatically.', 'debug');
        nn.load(nn.jQueryUrl, _init);
    };

    nn.init = nn.initialize;

    nn.jQueryUrl = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';

    nn.load = function(url, callback) {

        var head = document.getElementsByTagName('head')[0];
        var _dfd = null;

        // load css
        if (typeof url == 'undefined') {
            // TODO: report loaded objects
        } else if (url === null || url === '') {

            // bypass
            _dfd = $.Deferred();
            if (typeof callback == 'function') {
                _dfd.done(callback);
            }
            return _dfd.resolve();

        } else if (typeof url == 'string' && url.substr(-4, 4) == '.css') {

            _dfd = $.Deferred();
            var css = document.createElement('link');
            css.type = "text/css";
            css.rel = "stylesheet";
            css.href = url;
            css.onload = function() {
                if (typeof callback == 'function') {
                    _dfd.done(callback);
                }
                _dfd.resolve();
            };
            nn.log('nn.load: load CSS from "' + url + '"', 'debug');
            head.appendChild(css);
            return _dfd.promise();

        } else if (typeof url == 'string') {

            if (typeof $ != 'undefined') {
                // using jQuery
                nn.log('nn.load: load JS by jQuery "' + url + '"', 'debug');
                return $.getScript(url, callback);
            }
            // without using jQuery
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = callback;
            nn.log('nn.load: load JS from "' + url + '"', 'debug');
            head.appendChild(script);
            return script;

        } else if (typeof url == 'object' && $.isArray(url)) {

            nn.log('nn.load: loading resources', 'debug');

            var promises = [ ];
            $.each(url, function(i, u) {
                promises.push(nn.load(u));
            });

            return nn.when(promises).then(function() {

                nn.log('nn.load: all resources are loaded', 'debug');

            }, function() {

                nn.log('nn.load: not all resources are loaded', 'warning');
            });

        } else {

            // reject
            return $.Deferred().reject();
        }
    };

    nn.log = function(message, type) {

        var blackbird = function() { };

        if ((typeof window == 'undefined' || typeof window.console == 'undefined' || typeof window.console.log == 'undefined') &&
            (typeof console == 'undefined' || typeof console.log == 'undefined')) {

            return;
        }

        if (typeof message == 'undefined') {
            return nn.logTypes;
        } else if (typeof message == 'boolean') {
            if (typeof type == 'undefined') {
                $.each(nn.logTypes, function(i, logType) { nn.logTypes[i] = message; });
            } else {
                nn.logTypes[type] = message;
            }
            return nn.logTypes;
        }

        if (typeof type == 'undefined') {
            type = 'undefined';
        }

        if (nn.logTypes[type] === false) {
            return false;
        }

        switch (type) {

            case 'info':
            if (typeof console.info == 'function') {
                console.info(message);
            } else if (typeof console.log == 'function') {
                console.log('[i] ' + message);
            }
            break;

            case 'warning':
            if (typeof console.warn == 'function') {
                console.warn(message);
            } else if (typeof console.log == 'function') {
                console.log('[!] ' + message);
            }
            break;

            case 'error':
            if (typeof console.error == 'function') {
                console.error(message);
            } else if (typeof console.log == 'function') {
                console.log('[x] ' + message);
            }
            break;

            case 'debug':
            if (typeof console.debug == 'function') {
                console.debug(message);
            } else if (typeof console.log == 'function') {
                console.log(message);
            }
            break;

            case 'undefined':
            if (typeof console.log == 'function') {
                console.log(message);
            }
            break;

            case 'verbose':
            if (typeof console.debug == 'function') {
                console.debug(message);
            } else if (typeof console.log == 'function') {
                console.log(message);
            }
            break;

            default:
            if (typeof console.log == 'function') {
                console.log('[' + type + '] ' + message);
            }
        }

        return nn.logTypes[type];
    };

    nn.nonCredentialUrls = [
        'gdata.youtube.com',
        'graph.facebook.com',
        'api.catchpo.tw'
    ];
    
    nn.api = function(method, resourceURI, parameter, callback, dataType) {
        
        nn.log('nn.api: ' + method + ' "' + resourceURI + '"', 'debug');
        
        if ($.inArray(method, ['PUT', 'GET', 'POST', 'DELETE', 'HEAD', 'OPTIONS']) == -1) {
            nn.log('nn.api: not supported method', 'warning');
            return;
        }
        
        var withCredentials = true;
        for (var i = 0; i < nn.nonCredentialUrls.length; i++) {
            var url = nn.nonCredentialUrls[i];
            if (resourceURI.indexOf(url) > 0) {
                withCredentials = false;
            }
        }

        var localParameter = null;
        var localCallback = null;
        var localDataType = 'json';
        
        if (typeof parameter == 'function') {
            localCallback = parameter;
            if (typeof callback == 'string') {
                localDataType = callback;
                nn.log('nn.api: dataType = ' + localDataType, 'debug');
            }
        } else if (typeof parameter == 'object' || (typeof parameter == 'string' && 
                                                    $.inArray(parameter, [ 'xml', 'html', 'script', 'json', 'jsonp', 'text' ]) < 0)) {
            
            localParameter = parameter;
            if (typeof callback == 'function') {
                localCallback = callback;
                if (typeof dataType == 'string') {
                    localDataType = dataType;
                    nn.log('nn.api: dataType = ' + localDataType, 'debug');
                }
            } else if (typeof callback == 'string') {
                    localDataType = callback;
                    nn.log('nn.api: dataType = ' + localDataType, 'debug');
            }
        } else if (typeof parameter == 'string') {
            
            localDataType = parameter;
            nn.log('nn.api: dataType = ' + localDataType, 'debug');
        }

        nn.log(localParameter, 'verbose');
        
        // workaround
        if (method == 'DELETE' && localParameter) {
            nn.log('nn.api: workaround', 'debug');
            var queryString = $.param(localParameter);
            var conjunction = resourceURI.indexOf('?') < 0 ? '?' : '&';
            resourceURI = [ resourceURI, queryString ].join(conjunction);
            localParameter = null;
        }
        
        var _dfd = $.ajax({
            'url':        resourceURI,
            'type':       method,
            'cache':      false,
            'data':       localParameter,
            'dataType':   localDataType,
            'statusCode': nn.apiHooks,
            'xhrFields': {
                'withCredentials': withCredentials
            },
            'success': function(data, textStatus, jqXHR) {
                nn.log('nn.api: HTTP ' + jqXHR.status + ' ' + jqXHR.statusText, 'debug');
                nn.log('nn.api: textStatus = ' + textStatus, 'debug');
                nn.log(data, 'verbose');
            },
            'error': function(jqXHR, textStatus) {
                nn.log('nn.api: ' + jqXHR.status + ' ' + jqXHR.statusText, 'warning');
                nn.log('nn.api: textStatus = ' + textStatus, 'debug');
                nn.log('nn.api: responseText = ' + jqXHR.responseText, 'debug');
            }
        });
        if (typeof localCallback == 'function') {
            
            _dfd.done(localCallback);
        }
        
        return _dfd.promise();
    };
    
    nn.when = function(promises) {
        
        var _dfd = $.Deferred();
        var count = promises.length;
        var countCommited = 0;
        
        if (!$.isArray(promises)) {
            nn.log('nn.when: parameter error', 'error');
            _dfd.reject();
            return _dfd.promise();
        }
        
        nn.log('nn.when: ' + count + ' promises', 'debug');
        var resolved = true;
        
        $.each(promises, function(i, promise) {
            
            if (promise === null) {
                nn.log('nn.when: by-passing `null`', 'debug');
                promise = $.Deferred().resolve();
            }

            promise.done(function() {
                
                nn.log('nn.when: promise ' + i + ' commited', 'debug');
                countCommited++;
                
            }).fail(function() {
                
                nn.log('nn.when: promise ' + i + ' not commited', 'warning');
                resolved = false;
                
            }).always(function() {
                
                count = count - 1;
                nn.log(count + ' promises left', 'debug');
                if (count === 0) {
                    nn.log('total promises commited = ' + countCommited, 'debug');
                    if (resolved) {
                        _dfd.resolve(countCommited);
                    } else {
                        _dfd.reject(countCommited);
                    }
                }
            });
        });
        
        return _dfd.promise();
    };
    
    nn.apiHooks = {
        '200': function(jqXHR, textStatus) { },
        '201': function(jqXHR, textStatus) { },
        '400': function(jqXHR, textStatus) { },
        '401': function(jqXHR, textStatus) { },
        '403': function(jqXHR, textStatus) { },
        '404': function(jqXHR, textStatus) { },
        '500': function(jqXHR, textStatus) { }
    };
    
    nn.on = function(type, hook) {
        if ($.isArray(type)) {
            $.each(type, function(i, item) {
                nn.on(item, hook);
            });
        } else if (typeof nn.apiHooks[type] != 'undefined') {
            nn.log('nn.on: hook on [' + type + ']', 'debug');
            nn.apiHooks[type] = hook;
        }
    };
    
    nn._ = function(orig, repl) {
        
        var result = '*FIX ME!*';
        
        if (typeof orig == 'string') {
            
            result = (typeof nn.langPack[orig] == 'string') ? nn.langPack[orig] : orig;
            
        } else if ($.isArray(orig) && orig.length > 0) {
            
            var digg = nn.langPack;
            while (orig.length > 1) {
                var piece = orig.shift();
                if (typeof digg[piece] != 'undefined') {
                    digg = digg[piece];
                }
            }
            orig = orig.shift();
            result = (typeof digg[orig] == 'string') ? digg[orig] : orig;
        }
        
        if ($.isArray(repl)) {
            for (var i = 0; i < repl.length; i++) {
                result = result.replace('{' + i + '}', repl[i]);
            }
        } else if (typeof repl == 'string') {
            result = result.replace('{0}', repl);
        }
        
        return result;
    };
    
    // TODO: pack is a url
    nn.i18n = function(pack) {
        nn.langPack = $.extend(nn.langPack, pack);
    };
    
    nn.langPack = { };

    nn.logTypes = {
        // enable/disable log separately
        'info':    true,
        'warning': true,
        'error':   true,
        'debug':   true,
        'verbose': false
    };
    
    nn.debug = function(turnOn) {

        if (typeof turnOn == 'undefined') {

            return nn.logTypes.debug;

        } else if (typeof turnOn == 'boolean') {

            nn.logTypes.debug = turnOn;

        } else {

            nn.log(turnOn, 'debug');
        }
    };

    nn.verbose = function(turnOn) {

        if (typeof turnOn == 'undefined') {

            return nn.logTypes.verbose;

        } else if (typeof turnOn == 'boolean') {

            nn.logTypes.verbose = turnOn;

        } else {

            nn.log(turnOn, 'verbose');
        }
    };

    nn.info = function(turnOn) {

        if (typeof turnOn == 'undefined') {

            return nn.logTypes.info;

        } else if (typeof turnOn == 'boolean') {

            nn.logTypes.info = turnOn;

        } else {

            nn.log(turnOn, 'info');
        }
    };

    nn.warning = function(turnOn) {

        if (typeof turnOn == 'undefined') {

            return nn.logTypes.warning;

        } else if (typeof turnOn == 'boolean') {

            nn.logTypes.warning = turnOn;

        } else {

            nn.log(turnOn, 'warning');
        }
    };

    nn.error = function(turnOn) {

        if (typeof turnOn == 'undefined') {

            return nn.logTypes.error;

        } else if (typeof turnOn == 'boolean') {

            nn.logTypes.error = turnOn;

        } else {

            nn.log(turnOn, 'error');
        }
    };

    nn.getFileTypeByName = function(name) {
        
        if (typeof name == 'undefined' || name === null || name === '' || name.indexOf('.') <= 0) {
            return '';
        }
        return name.substr(name.indexOf('.'));
    };

})(nn);

if (typeof define != 'undefined') {

    define([ nn.jQueryUrl ], function($) {
        nn.log('AMD', 'debug');
        return nn;
    });
}

