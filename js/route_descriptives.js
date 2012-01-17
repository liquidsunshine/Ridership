function ApplyTemplateDescriptives(msg) {
	// This method loads the HTML template and
	//  prepares the container div to accept data.
	
	$('#descriptives').setTemplateURL('/js/js_tpl/descriptives.tpl');
      
	// This method applies the JSON array to the 
	//  container's template and renders it.
	$('#descriptives').processTemplate(msg);
	
	$("#descriptives_table tr:even").addClass("alt");
	$("#descriptives_table tr:last").css('font-weight', 'bold');
      }

function show_descriptives(route_num) {

  $(function () {

    $.getJSON(
      '/model/descriptives.php', 
      {route_num: route_num},
      function(json) { 
        if (!jQuery.isEmptyObject(json)) {
          ApplyTemplateDescriptives(json);
        }
    });
    
  });
}