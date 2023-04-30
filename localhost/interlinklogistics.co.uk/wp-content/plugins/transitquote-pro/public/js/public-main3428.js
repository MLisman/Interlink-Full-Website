/*window.addEventListener('error', function (e) {
   console.log("Error occurred: ");
   console.log(e);

   console.log(e.message);   
   console.log(e.error);   
   console.log(e.lineno);   
   console.log(e.filename);   

   return false;
}, true);
*/
(function ( $ ) {
	"use strict";

	$(document).on({
    'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('needsclick');
    	}
	}, '.pac-container');

	// Code by AS
	$(function () {
		if($('#quote-form').length>0){

			$('#quote-form').TransitQuotePro({
				ajaxUrl: TransitQuoteProSettings.ajaxurl,
				data: TransitQuoteProSettings,
			});
		}

	});


}(jQuery));
