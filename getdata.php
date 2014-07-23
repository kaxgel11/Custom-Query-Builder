<?php
/**
 * Created by IntelliJ IDEA.
 * User: kakha
 * Date: 5/21/2014
 * Time: 3:39 AM
 */
header('Content-Type: application/json');
$query=$_GET["q"];

$conn = mysqli_connect("localhost", "root", "", "mifostenant-default");
$conn->set_charset("utf8");
$result=mysqli_query($conn,$query);
$resultJson=array();
//echo $query;
while($row=mysqli_fetch_object($result)){
    array_push($resultJson,$row);
}
echo json_encode($resultJson, JSON_OBJECT_AS_ARRAY);