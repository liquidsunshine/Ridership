function ApplyTemplate(msg) {
	// This method loads the HTML template and
	//  prepares the container div to accept data.
	$('#graph10trip').setTemplateURL('/js/js_tpl/top_10_trips.tpl');
      
	// This method applies the JSON array to the 
	//  container's template and renders it.
	$('#graph10trip').processTemplate(msg);
	
	$("#top_trips_table tr:even").addClass("alt");
      }

function show_top_trips(route_num) {

  $(function () {

    $.getJSON(
      '/model/top_10_trips.php', 
      {route_num: route_num},
      function(json) { 
        if (!jQuery.isEmptyObject(json)) {
          ApplyTemplate(json); 
        }
    });
    
  });
}