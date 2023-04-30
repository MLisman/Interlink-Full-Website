(function ( $ ) {

	$.fn.RouteRequest = function RouteRequest(options) {

		if(!options){
			options = {};
		};
		// default settings of RouteRequest class
		var defaults = {
			origin: null,
			destination: null,
			waypoints: null,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false,
			optimizeWaypoints: false,
			callbackSuccess: function(){},
			callbackFailure: function(){}
		};

		this.settings = $.extend({}, defaults, options);

	};

	$.fn.RouteRequest.prototype = {
		
		optionsAreValid: function(options){

			if(options.origin===null){
				return false;
			};

			if(options.destination===null){
				return false;
			};
			
			return true;
		},

		requestRoute: function (options) {

			var that = this;
		
			// Instantiate a directions service.
			var directionsService = new google.maps.DirectionsService();

			directionsService.route(options, function (response, status) {
				that.response = response;
				that.status = status;
				if (status == google.maps.DirectionsStatus.OK) {
					that.routeRequestSucceeded();
				} else {
					that.routeRequestFailed();
				}
			});
		},

		routeRequestSucceeded: function(){
			this.settings.callbackSuccess(this.response);
		},

		routeRequestFailed: function(){
			if(!this.response){
				this.settings.callbackFailure(null);
			} else {
				this.settings.callbackFailure(this.response);
			}
		}

	};

}(jQuery));	