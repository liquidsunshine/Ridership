<?php
header("Content-Type: " . "text/javascript");
include($_SERVER["DOCUMENT_ROOT"]."/config.php");

if (! is_null($_GET['route_num'])) 
{
  $route_num = $_GET['route_num'];
} else {die("Confused.");}

// if (! is_null($_GET['data'])) 
// {
//   if ($_GET['data'] == 'trips') 
//   {
//     $table_name = 't_top_trips';
//     $id_key = 'departure_time';
//   }
//   else if ($_GET['data'] == 'stops') 
//   {
//     $table_name = 't_top_stops';
//     $id_key = 'bs_id';
//   }
//   else {die("Confused.");}
// }

// Connect to Database
$conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
  if (!$conn) { die("Connection failed to DB."); }

// Generate Query
$query = sprintf(
  "SELECT *
  FROM t_top_stops
  WHERE route_id = '%s'
  ORDER BY ons+offs DESC
  LIMIT 10;"
  ,pg_escape_string($route_num)
);

// Execute Query
$result = pg_query($conn, $query); if (!$result) { die("Query Failed."); }

$result_array = array();
$num_rows = pg_num_rows($result);
while ($row = pg_fetch_assoc($result)) {
  $result_array[] = array('bs_id' => $row['bs_id'], 'ons' => round($row['ons']), 'offs' => round($row['offs']), 'max_load' => round($row['max_load']), 'stop_lat' => $row['stop_lat'], 'stop_lon' => $row['stop_lon'], 'stop_name' => $row['stop_name']);
}

echo json_encode($result_array);

?>

