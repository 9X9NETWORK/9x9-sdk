/**
 * Main
 */
$(function() {
	
	prettyPrint();
	
	// intialize
	
	nn.initialize();
	
	// log
	
	nn.log('I am info');
	nn.log('I am info', 'info');
	nn.log('I am warning', 'warning');
	nn.log('I am error', 'error');
	nn.log('I am debug', 'debug');
	
	// i18n
	
	var langPack = { // this pack can be loaded from api
		
		'Helo {0}, there are {1} people online': '您好 {0}, 現在有 {1} 個人在線上',
		'World': '世界'
	};
	
	nn.i18n(langPack); // initialize i18n
	
	$('#i18n-btn-1').click(function() {
		
		alert(nn._('World'));
	});
	$('#i18n-btn-2').click(function() {
		
		alert(nn._('Helo {0}, there are {1} people online', ['louis', 2]));
	});
	$('#i18n-btn-3').click(function() {
		
		alert(nn._('Bye bye!'));
	});
	
	// api
	
	$('#api-login-submit').click(function() {
		
		var email = $('#api-login-email').val();
		var password = $('#api-login-password').val();
		var parameter = { 'email': email, 'password': password };
		
		nn.api('POST', 'api-login.php', parameter, function(user) {
			if (!user)
				alert('登入失敗');
			else
				alert('登入成功');
		});
	});
	
	nn.on(400, function(jqXHR, textStatus) {
		
		alert(textStatus + ": " + jqXHR.responseText);
	});
	
	$('#api-fail-call').click(function() {
		
		nn.api('POST', 'api-login.php', null /* 少了應有的參數 */, function(user) {
			
			// 這裡不會被執行
		});
	});
	
});

