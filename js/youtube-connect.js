/**
 * youtube-connect.js
 */
$(function() {
	
	nn.initialize();
	
	$('#youtube-connect').click(function() {
		
		var parameter = {
			'authUrl': 'https://accounts.google.com/o/oauth2/auth',
			'clientId': '1091882295489-nofkfvu4827mrbl6q1vp35kocp71tdhq.apps.googleusercontent.com',
			'scopes': [ 'https://www.googleapis.com/auth/plus.me', 'http://gdata.youtube.com/' ]
		};
		
		oauth2.login(parameter, function(token) {
			
			nn.log('token = ' + token);
			nn.log(oauth2);
			
			var url = 'http://gdata.youtube.com/feeds/api/users/default/playlists?callback=?';
			var parameter = {
				'max-results':  15,
				'v':            2,
				'alt':          'json-in-script',
				'access_token': token
			};
			$.getJSON(url, parameter, function(data) {
				nn.log(data);
				
				var message = '播放清單：\n';
				if (typeof data.feed.entry == 'object') {
					var entry = data.feed.entry;
					for (var i = 0; i < entry.length; i++) {
						message += entry[i].title.$t + '\n';
					}
					alert(message);
				}
			});
		});
	});
});
