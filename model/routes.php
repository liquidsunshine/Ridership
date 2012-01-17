<?php
  header("Content-Type: " . "text/javascript");
  include($_SERVER["DOCUMENT_ROOT"]."/config.php");

  $routes_array = array();
  $conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
    if (!$conn) { die("Connection failed to DB."); }

  $query = "SELECT DISTINCT route_id FROM routes ORDER BY route_id;";

  $result = pg_query($conn, $query);
  if (!$result) { die("Query Failed."); }

  while ($row = pg_fetch_assoc($result)) {
    $routes_array[] = $row["route_id"];
  }

  echo json_encode($routes_array);
?>