<?php
  header("Content-Type: " . "text/javascript");
  include($_SERVER["DOCUMENT_ROOT"]."/config.php");

  if (! is_null($_GET['route_num'])) 
  {
    $route_num = $_GET['route_num'];
  } else {die("Confused.");}

  $trips_array = array();
  $conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
    if (!$conn) { die("Connection failed to DB."); }

  $query = sprintf(
    "SELECT DISTINCT 
      trip_id, departure_time, end_time, trip_headsign
    FROM t_trips_display
    WHERE route_id = '%s' 
    ORDER BY departure_time;",
    $route_num
  );

  $result = pg_query($conn, $query);
  if (!$result) { die("Query Failed."); }

  while ($row = pg_fetch_assoc($result)) {
    $trips_array[] = $row;
  }

  echo json_encode($trips_array);
?>