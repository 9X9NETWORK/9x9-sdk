# 9x9 SDK 使用方法說明 #

**9x9 SDK** 為各個不同的前端專案共通的部分，提供一個統合的界面，力求減低被分別開發的各別前端應用間的差異。

[![Louis Jeng](http://goo.gl/2gC5w)](mailto:louis.jeng@9x9.tv) *2012.08.21*

--------------------------------------------------------------------------------

9x9 SDK 是用 Javascript 寫成，只要在網頁適當地方引入即可。請下載目前最新版本： [nn-sdk.js](js/nn-sdk.js)

## 相依元件 ##

* jQuery &gt;= 1.9.1 (自動載入)

## 初始化 ##

凡必先初始化始得以呼叫 9x9 SDK 之其它功能也。

    nn.init(function() {
        // put your code here
        nn.log('Hello, world!');
    });

如果說找不到 jQuery，它會自行載入。

## LOG ##

    nn.log('I am default log'); // recommended

    // other log levels
    nn.log('I am info log', 'info');
    nn.log('I am warning log', 'warning');
    nn.log('I am error log', 'error');
    nn.log('I am debug log', 'debug');     // default
    nn.log('I am verbose log', 'verbose'); // default is turned off unless you turn it on explicitly
    nn.log('I am customized log', 'whatever-you-want');

    // short cut
    nn.debug();      // get the debug log status
    nn.debug(false); // turn off debug log
    nn.debug(true);  // turn on debug log
    nn.debug('I am debug log message'); // log 'debug' message (so does tohers)

## i18 ##

<button id="i18n-btn-1">World</button>
<button id="i18n-btn-2">Helo {0}, there are {1} people online</button>
<button id="i18n-btn-3">Bye bye!</button>
    
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

### 多階層式的語言包結構及其呼叫方式 ###

<button id="i18n-btn-4">hello!my name is Louis</button>

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

## API ##

<label>拿登入 API 來作例子。( louis@tt.com / 111111 )</label><br />
<label>輸入正確的帳密登入成功，輸入錯誤的帳密登入失敗。</label><br />
<label>帳號：</label><input type="email" id="api-login-email"/>&nbsp;
<label>密碼：</label><input type="password" id="api-login-password"/>
<button id="api-login-submit">登入</button>
    
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

### API 呼叫的參數組合 ###

    nn.api(method, resourceURI [, parameter] [, callback] [, dataType]); // dataType 請參考 jQuery.ajax() dataType

### API 的錯誤處理 ###

要處理 API 的錯誤情形，先必需透過 *nn.on()* 來掛載所要被執行的 callback 函式。  
目前支援的掛載的錯誤碼有 200, 201, 400, 401, 403, 404, 500。  
如果同時掛載同樣錯誤碼兩次以上，後者會覆寫掉前者。  
callback 函式以 *null* 代替可以取消掛載。

<button id="api-fail-call">按我測試</button>&nbsp;<label>以錯誤的方式呼叫API－不帶任何參數</label>

    nn.on(400, function(jqXHR, textStatus) {
        
        alert(textStatus + ": " + jqXHR.responseText);
    });
    
    $('#api-fail-call').click(function() {
        
        nn.api('POST', 'api-login.php', null /* 少了應有的參數 */, function(user) {
            
            // 這裡不會被執行
        });
    });

或者一次掛載多個錯誤處理。

    nn.on([ 400, 401, 403, 404 ], function(jqXHR, textStatus) {
        
        alert(textStatus + ": " + jqXHR.responseText);
    });

<small>**註：由於 jQuery 在 ajax 錯誤處理的部分並不會對回傳的信息作 JSON 的解析。  
所以，API server 在 4XX 或 5XX 的情形下會選擇以 plain text 的方式回應，而不是 JSON 的格式。**</small>

### 進階 API 的使用：呼叫 YouTube API ###

你可以用 nn.api() 來呼叫 YouTube API。

<button id="api-youtube">呼叫 YouTube API</button>
    
    $('#api-youtube').click(function() {
        
        var param = {
            'v':   2,
            'alt': 'json'
        };
        
        nn.api('GET', 'http://gdata.youtube.com/feeds/api/users/louisje', param, function(data) {
            
            var entry = data.entry;
            
            nn.log(entry); // 請觀察 log
            
            alert(entry.title.$t);
        });
        
    });

### 進階 API 的使用：then() ###

與 jQuery then() 相同用法，後進入 then() 者會等先進入者執行結束才開始，並接收前者所回傳的值。  
程式碼範例是由 YouTube 的 user ID 取得該 user 的播放清單列表。再從列表中取得第一個播放清單。  
再從播放清單中取得第一個影片的資訊。全部用 then() 串在一起。

<button id="api-then">then() 範例</button>

    $('#api-then').click(function() {
        
        var param = { 'v': 2, 'alt': 'json' };

        nn.api('GET', 'http://gdata.youtube.com/feeds/api/users/louisje', param).then(function(data) {
            
            var entry = data.entry;
            var playlistUrl = entry.gd$feedLink.pop().href;
            
            return nn.api('GET', playlistUrl, param);
            
        }).then(function(data) {
            
            var entry = data.feed.entry.shift();
            nn.log(entry);
            
            return entry.media$group.media$title.$t;
            
        }).then(function(title) {
            
            alert(title);
            
        });

    });

### 進階 API 的使用：nn.when() ###

<span style="color:grey">v0.0.3</span>  
nn.when() 是 $.when() 的改良版。原本 $.when() 只支援固定個數的 promise 傳入。
nn.when() 在實現上更加彈性，將 promise 以陣列的方式傳入，可以支援不固定個數的 promise。
nn.when() 會回傳一個新的 promise。新的 promise 在所傳入的所有 promise 皆被兌現後，
才會被兌現(* done() *)。如果傳入的 promise 中任一個無法被兌現，回傳的 promise 會觸發失敗(* fail() *)。
範例是以 Youtube API 呼叫為例，當所有的 API 都呼叫成功 done() 才會被觸發，否則 fail() 就會被觸發。
更詳細的用法請參考<a href="http://api.jquery.com/jQuery.when/">$.when()</a>。

<button id="api-when">nn.when() 範例</button>
    
    $('#api-when').click(function() {
        
        var videoIds = [
            'UGLZC5em9Xo', 'EGYOEqBRThc', 'JwqM0XAJxnY', 'GCnCcg589xg',
            'rcbZ7XIc_K0', 'azP5vXYGYgg', 'mwQTHxWugWE', 'VN_kWGjgZDE',
            'JCOfxErrG8w', 'AHlyK5W7rIw', 'tXcCL2P2BmM', 'Q5JDf1ax5sw',
            'L07dKlGums0', 'L07dKlGums0', 'G9uMxVub7EE', 'bps3COJpST8'
        ];
        
        var apiBaseUrl = 'http://gdata.youtube.com/feeds/api/videos/';
        
        var promises = [ ];
        
        $.each(videoIds, function(i, videoId) {
            var promise = nn.api('GET', apiBaseUrl + videoId, 'v=2&amp;alt=json', 'json');
            promises.push(promise);
        });
        
        var whenPromise = nn.when(promises);
        
        whenPromise.done(function() {
            alert('done!');
        }).fail(function() {
            alert('fail!');
        });
    });

## Loader ##

<span style="color:grey">v0.0.6</span>  
載入 CSS/JS 並套用至當前頁面。

<button id="load-btn">載入 jQuery UI</button>&nbsp;<label>一但載入成功，按鈕會被置換成 jquery-ui 'smoothness' 的 theme</label>
    
    $('#load-btn').click(function() {
        
        var cssUrl = '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/themes/smoothness/jquery-ui.css';
        var jsUrl = '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js';
        
        nn.load(jsUrl, function() {
            nn.load(cssUrl, function() {
                $('#load-btn').button();
            });
        });
    });

## 附錄 ##

### api-login.php ###

    <?php
    
    if (!isset($_REQUEST["email"]) || !isset($_REQUEST["password"])) {
        
        header("HTTP/1.1 400 Missing Parameter");
        header("Content-Type: application/json");
        
        echo "missing email or password";
        
        exit;
    }
    
    header("HTTP/1.1 200 OK");
    header("Content-Type: application/json");
    
    if ($_REQUEST["email"] == "louis@tt.com" &amp;&amp;
        $_REQUEST["password"] == "111111") {
        
        $response = array (
            "name"   => "Louis",
            "email"  => "louis@tt.com",
            "type"   => 1,
            "gender" => 1
        );
        
        echo json_encode($response);
        
    } else {
        
        echo json_encode(null);
        
    }

<div style="color:white">

    (function(url) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            nn.init();
        };
        head.appendChild(script);
        return script;
    })('http://dev.teltel.com/9x9-sdk/js/nn-sdk.js');

</div>

