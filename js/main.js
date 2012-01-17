var map;
var overlay;
var overlay2;
var markers = [];
var iwindow = new google.maps.InfoWindow();
var route_num_global;
var def_icon = "/images/gmaps/mm_20_red.png";
var high_icon = "/images/gmaps/high.png";

function init_accordion() {
  $(document).ready(
    function() {
      $('.menuContent').addClass('menuContentHide');
      
      $('.menuHeader').click(
	function() {
	  if ($(this).next().hasClass('menuContentHide')) {
	    $(this).next().animate({opacity: 1.0});
	    $(this).next().removeClass('menuContentHide');
	  } else {
	    $(this).next().animate(
	      {opacity: 0.0},
	      function() {$(this).addClass('menuContentHide');}
	    );
	  }
	});
  });
}

function init_map() {
  var stylez = [ { featureType: "all", elementType: "all", stylers: [{ saturation:-90 }] } ];
  
  var myLatlng = new google.maps.LatLng(32.746256, -117.160415);
  var myOptions = {
    zoom: 11,
    center: myLatlng,
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'darkmap'],
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['darkmap', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
    }
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  var styledMapOptions = {
      name: "B&W"
  }
  var darkMapType = new google.maps.StyledMapType(
      stylez, styledMapOptions);  
  map.mapTypes.set('darkmap', darkMapType);
  map.setMapTypeId('darkmap');
}

function initialize() {
  // Initialize Route Dropdown Box
  $.getJSON('/model/routes.php', function(data) {
    $.each(data, function(index, text) {
      $('select[name="route_select"]').append(
	$('<option></option>').val(text).html(text)
      );
    });
  });
  
  init_accordion();
  
  init_map();
  
  show_route('1');
}

function show_route(route_num) {
  route_num_global = route_num;
  
  // Reset Overlays and Graph DIVs
  if (overlay != null) overlay.setMap();
  if (overlay2 != null) overlay2.setMap();
  $( "#graph" ).empty();
  $( "#graph10stop" ).empty();
  $( "#graph10trip" ).empty();
  $( "#descriptives" ).empty();
  clear_markers();
  
  // Activate Route-specific Modules
  $( "#activityHeader" ).html("Activity by Hour");
  $( "#top10header" ).show();
  $( "#descriptivesHeader" ).show();
  
  // Add overlays to Map
  overlay = new google.maps.KmlLayer('http://ridership.transitgis.org/model/kml/line_string.php?route_num='+route_num);
  overlay.setMap(map);
  show_route_activity(route_num);
  show_stops(route_num, "route");
  
  // Show and sort trips table
  show_top_trips(route_num);
  show_top_stops(route_num);
  show_descriptives(route_num);
  
  // Update Trip Dropdown Box
  $.getJSON('/model/trips.php', 
    { route_num: route_num },
    function(data) {
      $('select[name="trip_select"]').find('option').remove().end().append('<option value="">Whole Route</option>').val('whatever');
      $.each(data, function(index, text) {
        var trip_id = text.trip_id;
        var trip_time = text.departure_time;
        var trip_end = text.end_time;
        var trip_headsign = text.trip_headsign;
        $('select[name="trip_select"]').append(
          $('<option></option>').val(trip_id).html(trip_time+" - "+trip_end+" ("+trip_headsign+")")
        );
      });
  });
}

function show_trip(trip_num) {
  if (trip_num == '') {
    show_route(route_num_global);
    return;
  }
  if (overlay != null) overlay.setMap();
  if (overlay2 != null) overlay2.setMap();
  $( "#graph" ).empty();
  $( "#graph10stop" ).empty();
  $( "#graph10trip" ).empty();
  $( "#descriptives" ).empty();
  clear_markers();
  
  // Activate Trip-Specific Modules
  $( "#activityHeader" ).html("Activity by Stop");
  $( "#top10header" ).hide();
  $( "#descriptivesHeader" ).hide();
  
  overlay = new google.maps.KmlLayer('http://ridership.transitgis.org/model/kml/line_string.php?trip_num='+trip_num); 
  overlay.setMap(map);
  show_stops(trip_num, "trip");
  
  show_trip_activity(trip_num);
}

function clear_markers() {
  if (markers) {
    for (i in markers) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }
}

function force_show_trip(trip_id) {
  $('select[name="trip_select"]').val(trip_id);
  $('select[name="trip_select"]').change();
}

//+ Carlos R. L. Rodrigues
//@ http://jsfromhell.com/array/average [rev. #1]
average = function(a){
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / t), r;
}

function z_icon(icon, z) {
  var this_icon = icon;
  if (z > 2) {
    this_icon = "/images/gmaps/n2.png";
  } else if (z > 1) {
    this_icon = "/images/gmaps/n1.png";
  } else if (z > -1) {
    this_icon = "/images/gmaps/p0.png";
  } else if (z <= -1) {
    this_icon = "/images/gmaps/p1.png";
  }
  return this_icon;
}

function show_stops(id_num, type) {
  if (type=="trip") {
    var url = '/model/trip_stop_activity.php';
    var opts = { trip_num: id_num };  
  } else if (type=="route") {
    var url = '/model/route_stop_activity.php';
    var opts = { route_num: id_num };  
  }
  
  $.getJSON(url, 
    opts,
    function(data) {
      
/*      alert(data.length);*/
      // Calculate the z-scores
      var arr = new Array();
      $.each(data, function(index, item) {
	arr[index] = item.ons+item.offs;
      });
      var stats = average(arr);
      var data2 = Array();
      $.each(data, function(index, item) {
	var val = item.ons+item.offs;
	var z = (val-stats.mean)/stats.deviation;
	item.z = z;
	data2[index] = item;
      });
      $.each(data2, function(index, item) {
	var this_icon = def_icon;
	this_icon = z_icon(this_icon, item.z);
	
	setTimeout(function() {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.stop_lat,item.stop_lon),
            map: map,
            draggable: false,
            icon: this_icon,
            animation: google.maps.Animation.DROP,
            title: "Stop "+item.bs_id,
	    id: item.bs_id
          });
	  marker.z = item.z;
          markers.push(marker);
          google.maps.event.addListener(marker, 'click', function() {
            var content = "<h3>Stop "+item.bs_id+"</h3>" +
              "<p>Description: "+item.stop_name+"</p>" +
              "<p>Boardings: "+item.ons+"</p>" +
              "<p>Alightings: "+item.offs+"</p>";
            iwindow.setContent(content);
            iwindow.open(map, marker);
          });
        }, index * 10);
      });
  });
}