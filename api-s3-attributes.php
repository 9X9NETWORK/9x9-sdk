<?php
	
	//require_once('aws-sdk-for-php/sdk.class.php');
	
	$iExpirationTime = 3600;
	$sBucket = '9x9tmp-ds';
	$sAWSSecretKey = 'fdXkONXak8YC8TylX7fVSte5nvhFJ0RB7KnXGhpl';
	$sAWSAPIKey = 'AKIAIUZXV6X5RKSG3QRQ';
	
	if (!isset($_REQUEST['prefix']) ||
	    !isset($_REQUEST['acl'])    ||
	    !isset($_REQUEST['type'])   ||
	    !isset($_REQUEST['size'])) {
		
		header("HTTP/1.1 400 Missing Parameter");
		header("Content-Type: application/json");
		
		echo "missing email or password";
		
		exit;
		
	}
	
	$sPrefix = $_REQUEST['prefix'];
	$sACL = $_REQUEST['acl'];
	$sContentType = $_REQUEST['type'];
	$iSize = $_REQUEST['size'];
	
	$oPolicy = array (
		"expiration" => gmdate("Y-m-d\\TH:i:s\\Z", time() + $iExpirationTime),
		"conditions" => array (
			array ("bucket" => $sBucket),
			array ("starts-with", '$key', $sPrefix),
			array ("acl" => $sACL),
			array ("starts-with", '$Content-Type', $sContentType),
			array ("success_action_status" => '201'),
			array ("starts-with", '$Filename', ''),
			array ("content-length-range", 0, $iSize),
		)
	);
	$sPolicy = base64_encode(json_encode($oPolicy));
	
	/***
	$sPolicy = "{ 'expiration': '" . gmdate("Y-m-d\\TH:i:s\\Z", time() + $iExpirationTime) . "'," .
	           "'conditions': [" .
	           "{ 'bucket': '" . $sBucket . "' }," .
	           "[ 'starts-with', '\$key', '']," .
	           "{ 'acl': '" . $sACL . "' }," .
	           "[ 'starts-with', '\$Content-Type', '" . $sContentType . "' ]," .
	           "{ 'success_action_status': '201' }," .
	           "[ 'starts-with', '\$Filename', '' ]," .
	           "[ 'content-length-range', 0, 1073741824 ]," .
	           "]" .
	           "}";
	***/
	$sSignature = base64_encode(hash_hmac('sha1', $sPolicy, $sAWSSecretKey, true));
	
	header("HTTP/1.1 200 OK");
	header("Content-Type: application/json");
	
	echo json_encode(array (
		'bucket' => $sBucket,
		'id' => $sAWSAPIKey,
		'policy' => $sPolicy,
		'signature' => $sSignature
	));
	
