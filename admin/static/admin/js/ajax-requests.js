(function($) ***REMOVED***
	$(".form-request").submit(function(event) ***REMOVED***
       	event.preventDefault();
       	$.ajax(***REMOVED*** 
       		data: $(this).serialize(),
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            success: function(response) ***REMOVED***
	            console.log(response);
	            if(response['success']) ***REMOVED***
	            	alert(response['success']);
	            	if(response['redirect'])***REMOVED***
	            		window.location.href = response['redirect'];
	            	***REMOVED***else***REMOVED***
		            	window.location.href = "../";
	            	***REMOVED***
	            ***REMOVED***
	            if(response['error']) ***REMOVED***
	            	alert(response['error']);
	            	$("#id_error-text").html("Error: "+response['error']+"");
	            ***REMOVED***
        	***REMOVED***,
	        error: function (request, status, error) ***REMOVED***
	            console.log(request.responseText);
	        ***REMOVED***
       	***REMOVED***);
   	***REMOVED***);

   	$(".link-request").click(function(event)***REMOVED***
   		event.preventDefault();
   		$.ajax(***REMOVED***
   			url: $(this).attr('href'),
   			success: function(response)***REMOVED***
   				console.log(response);
	            if(response['success']) ***REMOVED***
	            	alert(response['success']);
	            	if(response['redirect'])***REMOVED***
	            		window.location.href = response['redirect'];
	            	***REMOVED***else***REMOVED***
		            	window.location.href = "../";
	            	***REMOVED***
	            ***REMOVED***
	            if(response['error']) ***REMOVED***
	            	alert(response['error']);
	            	$("#id_error-text").html("Error: "+response['error']+"");
	            ***REMOVED***
   			***REMOVED***,
	        error: function (request, status, error) ***REMOVED***
	            console.log(request.responseText);
	        ***REMOVED***
   		***REMOVED***);
   	***REMOVED***);

***REMOVED***)(jQuery);