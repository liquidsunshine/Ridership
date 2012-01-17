function show_top_stops(route_num) {

  $(function () {

    $.getJSON(
      '/model/top_10_stops.php', 
      {route_num: route_num},
      function(json) { 

      var on_data = new Array(); 
      var off_data = new Array(); 
      var plot_ticks = new Array(); 
      var stop_dict = {};
	  
      for (var i in json) { 
	i = parseInt(i); 
	on_data.push([i, json[i].ons]); 
	off_data.push([i, -json[i].offs]); 
	stop_dict[i] = json[i];
//	plot_ticks.push([i+0.5, json[i].bs_id]); 
      } 
      
      if (!jQuery.isEmptyObject(on_data)) {
	var placeholder = $("#graph10stop");
	var data = [{ data: on_data, label: "Boardings", color: "#1166aa" }, { data: off_data, label: "Alightings", color: "#AA5510" }];

	$.plot(placeholder, data, {
	  xaxis: { axisLabel: 'Top Stops', axisLabelUseCanvas: true, axisLabelFontSizePixels: 10, axisLabelFontFamily: 'Arial' },
	  bars: { show: true, barWidth: 0.5, fill: 0.9, steps: true },
	  grid: { hoverable: true, clickable: true }
	});
      }

      function showTooltip(x, y, contents) {
	$('<div id="tooltip">' + contents + '</div>').css( {
	  position: 'absolute', display: 'none', top: y + 5, left: x + 15, border: '1px solid #fdd',
	  padding: '2px', 'background-color': '#fee', opacity: 0.80
	}).appendTo("body").fadeIn(50);
      }

      // create tooltip hover event, data: 'stops'
      var previousPoint = null;
      $(placeholder).bind("plothover", function (event, pos, item) {
	if (true) {
	  if (item) {
	    if (previousPoint != item.dataIndex) {
	      previousPoint = item.dataIndex;
	      
	      $("#tooltip").remove();
	      var x = item.datapoint[0].toFixed(2),
		  y = item.datapoint[1].toFixed(2);
		
	      showTooltip(item.pageX, item.pageY, 
		"Stop ID: " + json[item.dataIndex].bs_id + "<br />" +
		"Boardings: " + Number(json[item.dataIndex].ons) + "<br />" +
		"Alightings: " + Number(json[item.dataIndex].offs) + "<br />"
	      );
	    }
	  }
	  else {
	    $("#tooltip").remove();
	    previousPoint = null;            
	  }
	}
      });

      // Create onclick event
      $(placeholder).bind("plotclick", function (event, pos, item2) {
  	if (item2) {
	  var item = stop_dict[ item2.datapoint[0] ];
	  clear_markers();
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.stop_lat,item.stop_lon),
            map: map,
            draggable: false,
            icon: def_icon,
            animation: google.maps.Animation.DROP,
            title: "Stop "+item.bs_id,
	    id: item.bs_id
          });
          markers.push(marker);
          google.maps.event.addListener(marker, 'click', function() {
            var content = "<h3>Stop "+item.bs_id+"</h3>" +
              "<p>Description: "+item.stop_name+"</p>" +
              "<p>Boardings: "+item.ons+"</p>" +
              "<p>Alightings: "+item.offs+"</p>";
            iwindow.setContent(content);
            iwindow.open(map, marker);
          });
	  google.maps.event.trigger(marker, 'click');
  	}
      });

    });
    
  });
}