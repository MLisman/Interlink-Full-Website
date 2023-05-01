(function ( $ ) {

	$.fn.ReturnJourneyReturnToBaseOptionsBuilder = function ReturnJourneyReturnToBaseOptionsBuilder(options) {

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

	$.fn.ReturnJourneyReturnToBaseOptionsBuilder.prototype = {
		setOrigin: function(){
			this.routeOptions.origin = this.settings.routeAddressPickers.getFirstAddressPickerLocation();
			console.log('origin: '+this.routeOptions.origin.lat(),this.routeOptions.origin.lng())
			
		},

		setDest: function(){
			this.routeOptions.destination = new google.maps.LatLng(this.settings.startLat, this.settings.startLng);
			console.log('destination: '+this.routeOptions.destination.lat(),this.routeOptions.destination.lng())

		},

		setWaypoints: function(){
			var waypoints = this.settings.routeAddressPickers.getWaypointLocationsReturnJourneyReturnToBase();

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