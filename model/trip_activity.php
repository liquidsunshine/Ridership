<?php
header("Content-Type: " . "text/javascript");
include($_SERVER["DOCUMENT_ROOT"]."/config.php");

if (! is_null($_GET['trip_num'])) 
{
  $trip_num = $_GET['trip_num'];
} else {die("Confused.");}

// Connect to Database
$conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
  if (!$conn) { die("Connection failed to DB."); }

// Generate Query
$query = sprintf(
  "SELECT ons, offs, bs_id, stop_sequence
  FROM t_trip_activity
  WHERE ext_trip_id = '%s'
  ORDER BY stop_sequence;"
  ,pg_escape_string($trip_num)
);

// Execute Query
$result = pg_query($conn, $query);
  if (!$result) { die("Query Failed."); }

$result_array = array();
$num_rows = pg_num_rows($result);
while ($row = pg_fetch_assoc($result)) {
  $result_array[] = $row;
}

echo json_encode($result_array);

?>