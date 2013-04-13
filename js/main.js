/**
 * Main
 */

nn.init(function() {
	
	prettyPrint();
	
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

    langpack = {
        "who": {
            "my name is {0}": "我叫{0}"
        },
        "misc": {
            "symbol": {
                "?": "？",
                ".": "。",
                ",": "，"
            }
        },
        "hello!": "你好！"
    };
    nn.i18n(langpack);
	$('#i18n-btn-4').click(function() {
		
        var greeting = nn._("hello!")
                     + nn._(["who", "my name is {0}"], "louis")
                     + nn._(["misc", "symbol", "."]);
		alert(nn._(greeting));
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
    
    $('#api-youtube').click(function() {
        
        var param = {
            'v':   2,
            'alt': 'json'
        };
        
        nn.api('GET', 'http://gdata.youtube.com/feeds/api/users/shining0810', param, function(data) {
            
            var entry = data.entry;
            
            nn.log(entry); // 請觀察 log
            
            alert(entry.title.$t);
        });
        
    });
    
    $('#api-pipe').click(function() {
        
        var param = { 'v': 2, 'alt': 'json' };
        var promise = nn.api('GET', 'http://gdata.youtube.com/feeds/api/users/shining0810', param);

        promise.pipe(function(data) {
            
            var entry = data.entry;
            var playlistUrl = entry.gd$feedLink[4].href;
            
            return nn.api('GET', playlistUrl, param);
            
        }).pipe(function(data) {
            
            var entry = data.feed.entry[0];
            nn.log(entry);
            
            return nn.api('GET', entry.content.src, param);
            
        }).pipe(function(data) {
            
            var entry = data.feed.entry[0];
            nn.log(entry);
            
            return entry.media$group.media$title.$t;
            
        }).done(function(title) {
            
            alert(title);
            
        });

    });
    
    $('#api-when').click(function() {
        
        var videoIds = [
            'UGLZC5em9Xo', 'EGYOEqBRThc', 'JwqM0XAJxnY', 'zmolcop0i-I',
            'rcbZ7XIc_K0', 'azP5vXYGYgg', 'mwQTHxWugWE', 'VN_kWGjgZDE',
            'JCOfxErrG8w', 'AHlyK5W7rIw', 'tXcCL2P2BmM'
        ];
        
        var apiBaseUrl = 'http://gdata.youtube.com/feeds/api/videos/';
        
        var promises = [ ];
        
        $.each(videoIds, function(i, videoId) {
            var promise = nn.api('GET', apiBaseUrl + videoId, 'v=2&alt=json', 'json');
            promises.push(promise);
        });
        
        var whenPromise = nn.when(promises);
        
        whenPromise.done(function() {
            alert('done!');
        }).fail(function() {
            alert('fail!');
        });
    });
    
});

