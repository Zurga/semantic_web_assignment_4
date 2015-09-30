$('#no_inferencing').click(function () {
    var endpoint = 'http://localhost:5820/supermarket/query';
    var query = "select * where {?Product rdf:type super:Product }";
    var format = 'JSON';
    process_request('no_inferencing', endpoint, query, false);
});

$('#inferencing').click(function () {
    var endpoint = 'http://localhost:5820/supermarket/query';
    var query = "select * where {?Product rdf:type super:Product }";
    var format = 'JSON';
    process_request('inferencing', endpoint, query, true);
    $('.hidden').removeClass('hidden');
});

function process_request(id, endpoint, query, reasoning) {
    $.get('/sparql', data={'endpoint': endpoint, 'query':query, 'format': 'JSON', 'reasoning': reasoning}, function (json) {
		try {
			var vars = json.head.vars;

			var ul = $('<ul></ul>');
			ul.addClass('list-group');
            if (json.results.bindings.length === 0 ) {
                var li = $('<li></li>');
                li.addClass('list-group-item');
                li.append('<strong>There were no results, the supermarket must be empty...');
                ul.append(li);
            }

			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');
				li.addClass('list-group-item');

				$.each(vars, function(index, v){
					var v_type = value[v].type;
					var v_value = value[v].value;

					li.append('<strong>'+v+'</strong><br/>');

					// If the value is a URI, create a hyperlink
					if (v_type == 'uri') {
						var a = $('<a></a>');
						a.attr('href',v_value);
						a.text(v_value.replace(/.*#/,''));
						li.append(a);
					// Else we're just showing the value.
					} else {
						li.append(v_value);
					}
					li.append('<br/>');

				});
				ul.append(li);

			});

			$('#output_' + id).html(ul);
		} catch(err) {
			$('#output_' + id)('Something went wrong!');
		}
	});
}
