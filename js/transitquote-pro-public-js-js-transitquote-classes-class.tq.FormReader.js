(function ( $ ) {

	$.fn.FormReader = function FormReader(options) {
		if(!options){
			options = {};
		};

		// default settings of RouteRequest class
		var defaults = {
			formId: null
		};

		this.settings = $.extend({}, defaults, options);
		var formSelector = '#'+this.settings.formId;
		this.form = $(formSelector);
	};

	$.fn.FormReader.prototype = {

		getIsReturnJourney: function(){

		},

		getIsOptimizingWaypoints(){

		},

		getIsMixedTranportMode(){
			return false;
		}
	};

}(jQuery));