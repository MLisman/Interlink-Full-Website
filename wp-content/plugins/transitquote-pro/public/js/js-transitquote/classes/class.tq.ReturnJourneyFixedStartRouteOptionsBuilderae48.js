(function ( $ ) {

	$.fn.ReturnJourneyFixedStartRouteOptionsBuilder = function ReturnJourneyFixedStartRouteOptionsBuilder(options) {

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

	$.fn.ReturnJourneyFixedStartRouteOptionsBuilder.prototype = {
		setOrigin: function(){ // start at base
			this.routeOptions.origin = new google.maps.LatLng(this.settings.startLat, this.settings.startLng);
			//console.log('origin: '+this.routeOptions.origin.lat(),this.routeOptions.origin.lng())
		},

		setDest: function(){ // we are returning to collection, so pickup address is destination
			this.routeOptions.destination = this.settings.routeAddressPickers.getFirstAddressPickerLocation();
			//console.log('destination: '+this.routeOptions.destination.lat(),this.routeOptions.destination.lng())
		},

		setWaypoints: function(){
			//waypoints are all
			var waypoints = this.settings.routeAddressPickers.getAddressPickerWaypointsReturnJourneyFixedStart();
			if(waypoints.length>0){
				this.routeOptions.waypoints = waypoints;
			};
		},

		buildRouteOptions: function(){
			this.setOrigin();
			this.setDest();
			this.setWaypoints();
			if((this.routeOptions.origin)&&(this.routeOptions.destination)){
				return this.routeOptions;
			} else {
				return false;
			}
		}
	};	


}(jQuery));	