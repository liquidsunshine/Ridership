function show_trip_activity(trip_num) {

  $(function () {

    $.getJSON(
      '/model/trip_activity.php', 
      {trip_num: trip_num},
      function(json) { 

      var on_data = new Array(); 
      var off_data = new Array(); 
      var plot_ticks = new Array(); 
      var stop_dict = {};
	  
      for (var i in json) { 
	i = parseInt(i); 
	on_data.push([json[i].stop_sequence, json[i].ons]); 
	off_data.push([json[i].stop_sequence, -json[i].offs]); 
	stop_dict[json[i].stop_sequence] = json[i].bs_id;
//	plot_ticks.push([i+0.5, json[i].bs_id]); 
      } 
      
      if (!jQuery.isEmptyObject(on_data)) {
	var placeholder = $("#graph");
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

      // create tooltip hover event
      var previousPoint = null;
      $(placeholder).bind("plothover", function (event, pos, item) {
	if (true) {
	  if (item) {
	    if (previousPoint != item.dataIndex) {
	      previousPoint = item.dataIndex;
	      
	      $("#tooltip").remove();
	      var x = item.datapoint[0].toFixed(2),
		  y = item.datapoint[1].toFixed(2);
	      try {
		showTooltip(item.pageX, item.pageY, 
		  "Stop ID: " + json[item.dataIndex].bs_id + "<br />" +
		  "Boardings: " + Number(json[item.dataIndex].ons) + "<br />" +
		  "Alightings: " + Number(json[item.dataIndex].offs) + "<br />"
		);
	      } catch(e) {}
	    }
	  }
	  else {
	    $("#tooltip").remove();
	    previousPoint = null;            
	  }
	}
      });

    $(placeholder).bind("plotclick", function (event, pos, item) {
      if (true) {
	if (item) {
	  highlight_stop(stop_dict[ item.datapoint[0] ]);
	}
      }
    });

    });
    
  });
}

function highlight_stop(stop_id) {
  $.each(markers, function(index, item) {
    if (item.id == stop_id) {
      item.setIcon(high_icon);
      map.setCenter(item.getPosition());
      map.setZoom(15);
    } else {
      item.setIcon(z_icon(item.icon,item.z));
    }
  });
}