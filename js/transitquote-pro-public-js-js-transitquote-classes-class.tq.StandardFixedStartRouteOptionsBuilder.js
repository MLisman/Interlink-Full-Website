(function ( $ ) {

	$.fn.StandardFixedStartRouteOptionsBuilder = function StandardFixedStartRouteOptionsBuilder(options) {

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
			addressPickers: null,
			startLat: null,
			startLng: null
		};

		this.settings = $.extend({}, defaults, options);

		// set initialRouteOptions
		this.routeOptions = {
			travelMode: this.settings.travelMode,
			unitSystem: this.settings.unitSystem,
			avoidHighways: this.settings.avoidHighways,
			avoidTolls: this.settings.avoidTolls,
			optimizeWaypoints: this.settings.optimizeWaypoints,
			waypoints: []
		}



	};

	$.fn.StandardFixedStartRouteOptionsBuilder.prototype = {
		setOrigin: function(){
			this.routeOptions.origin = new google.maps.LatLng(this.settings.startLat, this.settings.startLng);
		},


		setDest: function(){
			this.routeOptions.destination = this.settings.routeAddressPickers.getLastAddressPickerLocation();
		},

		setWaypoints: function(){
			var waypoints = this.settings.routeAddressPickers.getWaypointLocationsFixedStart();
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