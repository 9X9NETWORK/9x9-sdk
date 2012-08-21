/**
 * Main
 */
;(function() {
	
	define(['jquery-wrapper', 'nn-sdk-wrapper'], function($, nn) {
		
		$('button').button().click(function() {
			nn.on(401, function() {
				alert(401);
			});
			nn.api('PUT', 'loop.php', null, function(data) {
				nn.log('REQUEST_MOETHOD = ' + data[1]['REQUEST_METHOD']);
			});
			/*
			$.ajax({
				'success': function(data, textStatus, jqXHR) {
					console.log(data);
					console.log(textStatus);
				}
				, 'url': './loop.php'
				, 'type': 'DELETE'
				, 'statusCode': {
					500: function() { console.log(500); }
					, 400: function() { console.log(400); }
					, 401: function() { console.log(401); }
					, 404: function() { console.log(404); }
				}
				, 'error': function(jqXHR, textStatus, errorThrown) {
					console.log('error: ' + jqXHR['status']);
				}
			});
			*/
		});
		
		nn.initialize();
		
		nn.log('I am info');
		nn.log('I am info', 'info');
		nn.log('I am warning', 'warning');
		nn.log('I am error', 'error');
		nn.log('I am debug', 'debug');
	});
	
})();

