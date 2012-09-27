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
			
            nn.on([ 400, 200 ], function(jqHXR, textStatus) {
                nn.log('hook: ' + textStatus);
            });
			var url = 'http://gdata.youtube.com/feeds/api/users/default/playlists';
			var parameter = {
				'max-results':  15,
				'v':            2,
				'alt':          'json',
				'access_token': token
			};
			nn.api('GET', url, parameter, function(data) {
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
