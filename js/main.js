/**
 * Main
 */
$(function() {
	
	prettyPrint();
	
	/*
	$('button').button().click(function() {
		nn.on(401, function() {
			alert(401);
		});
		nn.api('PUT', 'loop.php', null, function(data) {
			nn.log('REQUEST_MOETHOD = ' + data[1]['REQUEST_METHOD']);
		});
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
	});
	*/
	
	// intialize
	
	nn.initialize();
	
	// log
	
	nn.log('I am info');
	nn.log('I am info', 'info');
	nn.log('I am warning', 'warning');
	nn.log('I am error', 'error');
	nn.log('I am debug', 'debug');
	
	// i18n
	
	var langPack = {
		// this pack can be loaded from api
		'Helo {0}, there are {1} people online': '您好 {0}, 現在有 {1} 個人在線上',
		'World': '世界'
	};
	
	nn.i18n(langPack);
	
	$('#i18n-btn-1').text(nn._('World'));
	$('#i18n-btn-2').text(nn._('Helo {0}, there are {1} people online', ['louis', 2]));
	$('#i18n-btn-3').text(nn._('Bye bye!'));
	
});

