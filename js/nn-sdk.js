/**
 * nn.js
 */

var nn = { };

(function(nn) {
	
	nn.initialize = function() {
		nn.log('nn: initialized');
	};
	
	nn.log = function(message, type) {
		
		if (typeof type == 'undefined') {
			type = 'info';
		} else if (typeof nn.logTypes[type] == 'undefined') {
			return;
		}
		
		if (nn.logTypes[type]) {
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
					console.log('[-] ' + message);
				}
				break;
				
				case 'error':
				if (typeof console.error == 'function') {
					console.error(message);
				} else if (typeof console.log == 'function') {
					console.log('[!] ' + message);
				}
				break;
				
				case 'debug':
				if (typeof console.debug == 'function') {
					console.debug(message);
				} else if (typeof console.log == 'function') {
					console.log('[v] ' + message);
				}
				break;
				
				default:
			}
		}
	};
	
	nn.api = function(method, resourceURI, parameters, callback) {
		
		nn.log('nn.api: ' + method + ' "' + resourceURI + '"');
		nn.log(parameters, 'debug');
		
		if ($.inArray(method, ['PUT', 'GET', 'POST', 'DELETE']) == -1) {
			nn.log('nn.api: not supported method', 'warning');
			return;
		}
		
		$.ajax({
			'url':        resourceURI,
			'type':       method,
			'data':       parameters,
			'statusCode': nn.apiHooks,
			'success': function(data, textStatus, jqXHR) {
				nn.log('nn.api: HTTP ' + jqXHR.status + ' ' + jqXHR.statusText);
				nn.log('nn.api: textStatus = ' + textStatus, 'debug');
				nn.log(data, 'debug');
				if (typeof callback == 'function') {
					callback(data);
				}
			},
			'error': function(jqXHR, textStatus, errorThrown) {
				nn.log('nn.api: HTTP ' + jqXHR.status + ' ' + jqXHR.statusText, 'warning');
				nn.log('nn.api: textStatus = ' + textStatus);
			}
		});
	};
	
	nn.apiHooks = {
		200: function() { },
		201: function() { },
		400: function() { },
		401: function() { },
		404: function() { },
		500: function() { }
	};
	
	nn.on = function(type, hook) {
		if (typeof nn.apiHooks[type] != 'undefined') {
			nn.log('nn.on: hook on [' + type + ']');
			nn.apiHooks[type] = hook;
		}
	};
	
	nn.logTypes = {
		'info':    true, // turns log on/off
		'warning': true,
		'error':   true,
		'debug':   true
	};
	
})(nn);

