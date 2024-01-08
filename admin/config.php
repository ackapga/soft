<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mysql";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



$product = array(
    "link" => "label_2408d.php",
    "title" => "Product Title",
    "price" => 100.00,
    "desc" => "Product Description",
    "description" => "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis eligendi, id impedit optio reprehenderit sapiente? Ab commodi corporis cupiditate ea ex harum magni minus nisi non numquam possimus, ratione, vero!",
    "img" => "/images/2408D/1.png",
    "code" => "ABC123",
    "category_id" => 1,
    "parameter_id" => 1,
    "not_in_real_price" => false,
    "page_title" => "Product in page Title",
    "page_keyword" => "Product in page Description",
    "page_description" => "Product in page Description"
);



$category = array(
    "id" => 1,
    "name" => "Name",
    "parent" => "Name"
);

$parameter = array(
    "id" => 1,
    "series" => "aurora",
    "color" => "black",
    "readType" => 'image',
    "displayType" => 'resistive',
    "paperWidth" => 58,
    "weight" => 30,
    "printSpeed" => 90,
    "thermSource" => 100,
    "ram" => 4,
    "ssd" => 64,
    "diagonal" => 15.6,
    "interfaces" => array('serial', 'usb', 'wifi', 'lan'),
    "position" => array('table', 'trade'),
    "integration" => array(),
    "connections" => array('autonomous', 'bluetooth'),
    "scanType" => array('bar-code', 'qr-code'),
    "scanMode" => array('first', 'third', 'fourth', 'fifth'),
    "autoCut" => true,
    "winding" => false,
    "screenScan" => true,
    "clientDisplay" => true,
);