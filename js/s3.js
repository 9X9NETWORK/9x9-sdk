/**
 * s3.js
 */

$(function() {
	
	prettyPrint();
	
	nn.initialize();
	
	$('a').attr('target', '_blank');
	
	var parameter = {
		'prefix': 'cms',        // 檔名的前置字元
		'type':   'audio',
		'size':   312574800,    // 限制上傳大小為 300MB
		'acl':    'public-read' // 上傳檔案的權限為公開讀取
	};
	
	nn.api('GET', 'api-s3-attributes.php', parameter, function(s3attr) {
		
		var timestamp = (new Date()).getTime(); // 產生 timestamp 作為上傳檔名
		
		var handlerUploadProgress = function(file, completed /* completed bytes */, total /* total bytes */) {
			
			if (completed % 10 > 1 && completed != total) {
				// to prevent calling to frequenctly
				return;
			}
			var remaining = file.timeRemaining.toString(); // ex. '348.23628282'
			var eta = '--';
			if (remaining > 0)
				eta = remaining.substring(0, remaining.indexOf('.')) + ' s'; // ex. '348 s'
			
			$('#progress-bar').progressBar((completed * 100) / total);
			$('#eta').html('ETA: ' + eta).show();
		};
		
		var handlerUploadSuccess = function(file, serverData, recievedResponse) {
			
			if (!file.type)
				file.type = nn.getFileTypeByName(file.name); // Mac Chrome compatible
			
			nn.log('file upload success');
			$('#cancel-btn-holder').html('');
			$('#eta').html('');
			
			this.setButtonDisabled(false); // enable upload button again
			
			var url = 'http://' + s3attr['bucket'] + '.s3.amazonaws.com/' +
			          parameter['prefix'] + '-audio-' + timestamp + file.type;
			
			$('#file-name-holder').text(url).show();
		};
		
		var handlerUploadError = function(file, code, message) {
			
			$('#cancel-btn-holder').html('');
			$('#eta').html('');
			this.setButtonDisabled(false);
			
			if (code == -280) { // user cancel upload
				
			} else {
				
				nn.log('upload failed', 'warning');
				alert(message); // show some error prompt
				
			}
		};
		
		var handlerFileQueue = function(file) {
			
			if (!file.type)
				file.type = nn.getFileTypeByName(file.name); // Mac Chrome compatible
			
			var postParams = {
				"AWSAccessKeyId": s3attr['id'],
				"key":            parameter['prefix'] + '-audio-' + timestamp + file.type, // upload file name, TODO: need convention
				"acl":            parameter['acl'],
				"policy":         s3attr['policy'],
				"signature":      s3attr['signature'],
				"content-type":   parameter['type'],
				"success_action_status": "201"
			};
			
			nn.log(postParams);
			nn.log('start upload audio');
			nn.log(file);
			
			this.setPostParams(postParams);
			this.startUpload(file.id);
			this.setButtonDisabled(true);
			
			// reset progress bar
			$('#progress-bar')
				.text('')
				.progressBar({ barImage: 'http://202.5.224.193/louis/9x9-sdk-usage/img/progress-bg-black.gif' })
				.show();
			// dynamic generates cancel button
			$('<button></button>')
				.text('Cancel')
				.click({ 'swfupload': this, 'file': file }, function(event) {
					event.data.swfupload.cancelUpload(event.data.file.id);
				})
				.prependTo($('#cancel-btn-holder'));
			
			$('#file-name-holder').text(file.name).show();
			
		};
		
		var settings = {
			flash_url:               'http://202.5.224.193/louis/9x9-sdk-usage/js/swfupload/swfupload.swf',
			upload_url:              'http://' + s3attr['bucket'] + '.s3.amazonaws.com/', // http://9x9tmp-ds.s3.amazonaws.com/
			file_size_limit:         parameter['size'],
			file_types:              '*.mp3',
			file_types_description:  nn._('Audio Files'),
			file_post_name:          'file', // hardcode
			button_placeholder:      $('#s3-upload-btn').get(0), // 按鈕放置處的 DOM
			button_image_url:        'http://202.5.224.193/louis/9x9-sdk-usage/img/btn-upload.png', // 按鈕的圖檔，四幅式
			button_width:            '95',
			button_height:           '32',
			button_action:           SWFUpload.BUTTON_ACTION.SELECT_FILE, // hardcode
			button_cursor:           SWFUpload.CURSOR.HAND, // hardcode
			button_window_mode :     SWFUpload.WINDOW_MODE.OPAQUE, // hardcode
			http_success :           [ 201 ],
			                         // 名種 callback 函式 //
			upload_progress_handler: handlerUploadProgress,
			upload_success_handler:  handlerUploadSuccess,
			upload_error_handler:    handlerUploadError,
			file_queued_handler:     handlerFileQueue,
			                         // Debug Mode //
			debug:                   false
		};
		
		nn.log('initialize SWFUpload');
		nn.log(settings);
		
		var swfupload = new SWFUpload(settings);
	});
	
});

