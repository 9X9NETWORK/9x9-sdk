/**
 * facebook-connect.js
 */
$(function() {
	
	nn.initialize();
	
	FB.init({
		appId:     '127989843879617',
		status:     true, // check login status
		cookie:     true, // enable cookies to allow the server to access the session
		xfbml:      true, // parse XFBML
		oauth:      true, // enable OAth 2.0
		channelUrl: 'http://dev.teltel.com/louis/9x9-sdk-usage/js/channel.html'
	});
	
	$('#facebook-connect').click(function() {
		
		var permissions = 'email,' +
//		                  'friends_birthday,' +
//		                  'friends_education_history,' +
//		                  'friends_groups,' +
//		                  'friends_hometown,' +
//		                  'friends_interests,' +
//		                  'friends_likes,' +
//		                  'friends_location,' +
//		                  'friends_relationship_details,' +
//		                  'friends_subscriptions,' +
		                  'user_birthday,' +
		                  'user_education_history,' +
		                  'user_groups,' +
		                  'user_hometown,' +
		                  'user_interests,' +
		                  'user_likes,' +
//		                  'user_location,' +
		                  'user_relationship_details,' +
		                  'user_subscriptions,' +
		                  'publish_actions,' +
		                  'publish_actions.video,' +
		                  'friends_actions.video,' +
		                  'manage_friendlists,' +
		                  'publish_stream,' +
		                  'offline_access,' +
		                  'manage_pages';
		
		var callbackLogin = function(response) {
			
			nn.log(response);
			
			if (response.status != 'connected' || response.authResponse == null) {
				
				nn.log('not connected');
				return;
			}
			var userId = response.authResponse.userID;
			var token = response.authResponse.accessToken;
			
			var message = 'userId = ' + userId + '\n' +
			              'accessToken = ' + token.substr(0, 20) + '...' + '\n\n' +
			              'write them back through api';
			alert(message);
		};
		
		FB.login(callbackLogin, permissions);
	});
});
