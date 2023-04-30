(function ( $ ) {

	$.fn.ReturnToBaseOptionsBuilder = function ReturnToBaseOptionsBuilder(options) {

		if(!options){
			options = {};
		};

		// default settings of RouteRequest class
		var defaults = {
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false,
			optimizeWaypoints: false,
			routeAddressPickers: null
		};

		this.settings = $.extend({}, defaults, options);

		// set initialRouteOptions
		this.routeOptions = {
			travelMode: this.settings.travelMode,
			unitSystem: this.settings.unitSystem,
			avoidHighways: this.settings.avoidHighways,
			avoidTolls: this.settings.avoidTolls,
			optimizeWaypoints: this.settings.optimizeWaypoints
		}


	};

	$.fn.ReturnToBaseOptionsBuilder.prototype = {
		setOrigin: function(){
			this.routeOptions.origin = this.settings.routeAddressPickers.getFirstAddressPickerLocation();
		},

		setDest: function(){
			this.routeOptions.destination = new google.maps.LatLng(this.settings.startLat, this.settings.startLng);
		},

		setWaypoints: function(){
			var waypoints = this.settings.routeAddressPickers.getWaypointLocationsReturnToBase();

			if(waypoints.length>0){
				this.routeOptions.waypoints = waypoints;
			};
		},

		buildRouteOptions: function(){
			this.setOrigin();
			this.setDest();
			this.setWaypoints();
			return this.routeOptions;
		}		
	};


}(jQuery));	