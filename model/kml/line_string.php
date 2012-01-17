<?php
header("Content-Type: " . "application/vnd.google-earth.kmz");
include($_SERVER["DOCUMENT_ROOT"]."/config.php");

if (! is_null($_GET['route_num'])) 
{
  $route_num = $_GET['route_num'];

  // Generate Query
  $query = sprintf(
    "SELECT shape_id, shape_pt_lon, shape_pt_lat
    FROM shapes_small
    WHERE shape_id IN
    ( SELECT DISTINCT shape_id FROM trips WHERE route_id = '%s' )
    ORDER BY shape_pt_sequence LIMIT 10000;",
    pg_escape_string($route_num)
  );

  $title = "Route " . $route_num;
} 
else if (! is_null($_GET['trip_num'])) 
{
  $trip_num = $_GET['trip_num'];

  // Generate Query
  $query = sprintf(
    "SELECT shape_id, shape_pt_lon, shape_pt_lat
    FROM shapes_small
    WHERE shape_id IN
    ( SELECT DISTINCT shape_id FROM trips WHERE substring(trip_id from char_length(service_id)+1 for char_length(trip_id) - char_length(service_id)) = '%s' )
    ORDER BY shape_pt_sequence LIMIT 10000;",
    pg_escape_string($trip_num)
  );

  $title = "Trip " . $trip_num;
} 
else 
{
  die("Failed to specify a shape type.");
}

//// -- BELOW THIS STAYS THE SAME -- ////

function rand_color() {
  for ($i = 0; $i<6; $i++) $c .=  dechex(rand(0,15));
  return "$c";
}

// Connect to Database
$conn = pg_connect("host=$config_db_host port=$config_db_port dbname=$config_db_database user=$config_db_user password=$config_db_password");
  if (!$conn) { die("Connection failed to DB."); }

// Execute Query
$result = pg_query($conn, $query);
  if (!$result) { die("Query Failed."); }

// Convert rows to arrays!
$LineStringArray = array();
while ($row = pg_fetch_assoc($result)) {
  $lon = $row['shape_pt_lon'];
  $lat = $row['shape_pt_lat'];
  $id = $row['shape_id'];
  $LineStringArray[$id][] = array('lat' => $lat, 'lon' => $lon); 
}

$KMLString = "";

// Print Header
$KMLString .=
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
  <kml xmlns=\"http://www.opengis.net/kml/2.2\">
  <Document>
  <name>".$title."</name>
";

// Print Individual Route Data
foreach( array_keys($LineStringArray) as $shape) {
  $KMLString .= "
    <Placemark>
    <Style>
    <LineStyle>
    <color>bb1166ff</color>
    <width>3</width>
    </LineStyle>
    </Style>
    <name>".$title."</name>
    <description>Shape: ".$shape."</description>
    <LineString>
    <coordinates>
  ";

  foreach ($LineStringArray[$shape] as $point) {
    $KMLString .= $point['lon'] . "," . $point['lat'] . "\n";
  }

  $KMLString .= "
    </coordinates>
    </LineString>
    </Placemark>
  ";
}

$KMLString .= "
  </Document>
  </kml>
";


// Create KMZ
$ZIPfile = tempnam(sys_get_temp_dir(), "kmz_");
$zip = new ZipArchive();

if ($zip->open($ZIPfile, ZIPARCHIVE::CREATE) !== TRUE) {
    die ("Could not open archive");
}

$zip->addFromString("doc.kml", $KMLString) or die ("ERROR: Could not add file!");
$zip->close();

readfile($ZIPfile);

?>