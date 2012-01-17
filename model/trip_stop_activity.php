<?php
  header("Content-Type: " . "text/javascript");
  include($_SERVER["DOCUMENT_ROOT"]."/config.php");

  if (! is_null($_GET['trip_num'])) {
    $trip_num = $_GET['trip_num'];
  } else {die("No trip ID provided.");}

  // Generate Query
  $query = sprintf(
    "select * from t_trip_stop_activity where ext_trip_id='%s';",
    pg_escape_string($trip_num)
  );

  // Connect to Database
  $conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
    if (!$conn) { die("Connection failed to DB."); }

  // Execute Query
  $result = pg_query($conn, $query);
    if (!$result) { die("Query Failed."); }

  // Convert rows to arrays!
  $LineStringArray = array();
  while ($row = pg_fetch_assoc($result)) {
    $LineStringArray[] = array(
      'bs_id' => $row['bs_id'],
      'stop_name' => htmlspecialchars($row['stop_name']),
      'stop_lat' => $row['stop_lat'],
      'stop_lon' => $row['stop_lon'],
      'ons' => round($row['ons']),
      'offs' => round($row['offs'])
    );
  }

  
  echo json_encode($LineStringArray);
?>