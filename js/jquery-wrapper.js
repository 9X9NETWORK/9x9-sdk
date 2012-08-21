/**
 * JQuery Wrapper
 *
 * Wrap jQuery, jQuery UI, css file together
 *
 */

;(function() {
	
	requirejs.config({
		paths: {
			'css': 'https://raw.github.com/gist/3102735/018a0d9d6b390956956b0ef7a116daa2bd3b34c5/css'
			, 'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
			, 'jquery-ui': 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui'
			, 'jquery-ui-css': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/smoothness/jquery-ui'
		}
	});
	
	define(['css!jquery-ui-css', 'jquery', 'jquery-ui'], function() {
		return jQuery;
	});
	
})();

