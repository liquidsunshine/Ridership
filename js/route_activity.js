function show_route_activity(route_num) {

  $(function () {

    $.getJSON(
      '/model/route_activity.php', 
      {route_num: route_num},
      function(json) { 

      var on_data = new Array(); 
      var off_data = new Array(); 
      var plot_ticks = new Array(); 
	  
      for (var i in json) { 
	i = parseInt(i); 
	on_data.push([json[i].hour, json[i].ons]); 
	off_data.push([json[i].hour, -json[i].offs]); 
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
		  "Time of Day: " + json[item.dataIndex].hour + ":00<br />" +
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

    });
    
  });
}