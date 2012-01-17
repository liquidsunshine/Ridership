<?php
header("Content-Type: " . "text/javascript");
include($_SERVER["DOCUMENT_ROOT"]."/config.php");

function period_dict($num) {
  switch($num) {
    case 0:
      return "Early Morning";
    case 1:
      return "Morning Peak";
    case 2:
      return "Midday";
    case 3:
      return "Evening Peak";
    case 4:
      return "Night";
    default:
      return "Confused!";
  }
}

if (! is_null($_GET['route_num'])) 
{
  $route_num = $_GET['route_num'];
} else {die("Confused.");}

// Connect to Database
$conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
  if (!$conn) { die("Connection failed to DB."); }

// Generate Query
$query = sprintf(
  "SELECT *
  FROM t_route_descriptives
  WHERE route_id = '%s';"
  ,pg_escape_string($route_num)
);

// Execute Query
$result = pg_query($conn, $query); if (!$result) { die("Query Failed."); }

$result_array = array();
//$num_rows = pg_num_rows($result);
while ($row = pg_fetch_assoc($result)) {
  $result_array[$row['period']][$row['direction_id']] = array('period' => period_dict($row['period']), 'ons' => round($row['ons']), 'offs' => round($row['offs']));
}

$filled_results = array(
  'Early Morning' => array(
    'one' => array(
      'period' => $result_array[0]['one']['period'],
      'ons' => $result_array[0]['one']['ons'],
      'offs' => $result_array[0]['one']['offs']
    ),
    'zero' => array(
      'period' => $result_array[0]['zero']['period'],
      'ons' => $result_array[0]['zero']['ons'],
      'offs' => $result_array[0]['zero']['offs']
    )
  ),
  'Morning Peak' => array(
    'one' => array(
      'period' => $result_array[1]['one']['period'],
      'ons' => $result_array[1]['one']['ons'],
      'offs' => $result_array[1]['one']['offs']
    ),
    'zero' => array(
      'period' => $result_array[1]['zero']['period'],
      'ons' => $result_array[1]['zero']['ons'],
      'offs' => $result_array[1]['zero']['offs']
    )
  ), 
  'Midday' => array(
    'one' => array(
      'period' => $result_array[2]['one']['period'],
      'ons' => $result_array[2]['one']['ons'],
      'offs' => $result_array[2]['one']['offs']
    ),
    'zero' => array(
      'period' => $result_array[2]['zero']['period'],
      'ons' => $result_array[2]['zero']['ons'],
      'offs' => $result_array[2]['zero']['offs']
    )
  ),
  'Evening Peak' => array(
    'one' => array(
      'period' => $result_array[3]['one']['period'],
      'ons' => $result_array[3]['one']['ons'],
      'offs' => $result_array[3]['one']['offs']
    ),
    'zero' => array(
      'period' => $result_array[3]['zero']['period'],
      'ons' => $result_array[3]['zero']['ons'],
      'offs' => $result_array[3]['zero']['offs']
    )
  ),
  'Night' => array(
    'one' => array(
      'period' => $result_array[4]['one']['period'],
      'ons' => $result_array[4]['one']['ons'],
      'offs' => $result_array[4]['one']['offs']
    ),
    'zero' => array(
      'period' => $result_array[4]['zero']['period'],
      'ons' => $result_array[4]['zero']['ons'],
      'offs' => $result_array[4]['zero']['offs']
    )
  )
);

$tot_one_ons = 0;
$tot_one_offs = 0;
$tot_zero_ons = 0;
$tot_zero_offs = 0;
foreach ($filled_results as $row) {
  $tot_one_ons += $row['one']['ons'];
  $tot_one_offs += $row['one']['offs'];
  $tot_zero_ons += $row['zero']['ons'];
  $tot_zero_offs += $row['zero']['offs'];
}

$filled_results['Totals'] = array(
    'one' => array(
      'period' => 'Total',
      'ons' => $tot_one_ons,
      'offs' => $tot_one_offs
    ),
    'zero' => array(
      'period' => 'Total',
      'ons' => $tot_zero_ons,
      'offs' => $tot_zero_offs
    )
  );

if (empty($result_array)) {
  echo json_encode($result_array);
}
else {
  echo json_encode($filled_results);
}

?>

