<?php
	
	if (!isset($_REQUEST["email"]) || !isset($_REQUEST["password"])) {
		
		header("HTTP/1.1 400 Missing Parameter");
		header("Content-Type: application/json");
		
		echo "missing email or password";
		
		exit;
	}
	
	header("HTTP/1.1 200 OK");
	header("Content-Type: application/json");
	
	if ($_REQUEST["email"] == "louis@tt.com" &&
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
	
