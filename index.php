<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>

  <link href="/default.css" rel="stylesheet" type="text/css" />
  <link href="/js/jquery/jquery-custom.css" rel="stylesheet" type="text/css" />

  <title>GTFS/APC Prototype</title>

  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

  <script type="text/javascript" src="/js/jquery/jquery-1.6.1.js"></script>
  <script type="text/javascript" src="/js/jquery/jquery-jtemplates.js"></script>
  <script type="text/javascript" src="/js/jquery/jquery-ui.custom.js"></script>
  <script type="text/javascript" src="/js/jquery/jquery-tablesorter.js"></script>
  <script type="text/javascript" src="/js/jquery/flot/jquery.flot.js"></script>
  <script type="text/javascript" src="/js/jquery/flot/jquery.flot.axislabels.js "></script>
  <!--[if lt IE 9]>
    <script language="javascript" type="text/javascript" src="jquery/flot/excanvas.js"></script>
  <![endif]-->

  <script type="text/javascript" src="/js/top_10_trips.js"></script>
  <script type="text/javascript" src="/js/top_10_stops.js"></script>
  <script type="text/javascript" src="/js/trip_activity.js"></script>
  <script type="text/javascript" src="/js/route_activity.js"></script>
  <script type="text/javascript" src="/js/main.js"></script>
  <script type="text/javascript" src="/js/route_descriptives.js"></script>
</head>

<body onload="initialize()">
<div id="body" class="body">
  <div id="control">
    Select a new route/trip to show:<br />
    <div id="route_sel_div">
      Route: <select name="route_select" onchange="show_route(this.value);">
      </select>
    </div>
    <div id="trip_sel_div">
      Trip: <select name="trip_select" onchange="show_trip(this.value);">
      </select>
    </div>
  </div>
  <div id="content">
    <div id="map_canvas"></div>
    <div id="sidebar">
      <div class="menuHeader" id="activityHeader">Activity By Hour</div>
      <div id="graphShield">
        <div id="graph"></div>
      </div>
      <div class="menuHeader" id="top10header">Top 10 Trips/Stops</div>
      <div class="menuContent" id="info">
	<div id="graph10trip"></div>
	<div id="graph10stop"></div>
      </div>
      <div class="menuHeader" id="descriptivesHeader">Descriptives</div>
      <div class="menuContent" id="descriptives"></div>
    </div>
  </div>
</div>
<div class="body" style="margin-top: 5px;">
<p style="text-align: center;">Questions?  Comments?  Feel free to <a href="/faq/index.php?sid=7&lang=en&action=show" target="_blank">browse our FAQs</a> or <a href="/faq/index.php?action=ask" target="_blank">ask us a question</a>!</p>
</div>
  
</body>

</html>
