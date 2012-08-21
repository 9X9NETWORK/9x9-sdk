<?php
	
	header("HTTP/1.1 201 Qoo");
	header("Content-Type: application/json");
	echo json_encode(array (getallheaders(), $_SERVER));
	
