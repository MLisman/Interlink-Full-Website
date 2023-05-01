(function ( $ ) {

	$.fn.RouteAddressPickers = function RouteAddressPickers(options) {
		if(!options){
			options = {};
		};

		// default settings of RouteRequest class
		var defaults = {
			addressPickersObjects: null
		};

		this.settings = $.extend({}, defaults, options);
		this.addressPickers = this.settings.addressPickersObjects;
	};

	$.fn.RouteAddressPickers.prototype = {

		getFirstAddressPickerLocation: function(){
			// return LatLng for addresspicker 0
			return this.addressPickers[0].getPos();
		},

		getLastAddressPickerLocation: function(){
			//return LatLng for final addresspicker
			var addressPickerInputIndex = this.addressPickers.length - 1;
			return this.addressPickers[this.addressPickers.length - 1].getPos();
		},

		getAllAddressPickerLocations: function(){
			// return array of all addresspicker LatLngs
			var locations = [];
			$.each(this.addressPickers, function (idx, addressPicker) {
				var pos = addressPicker.getPos();
				locations.push(pos);
			});
			return locations;
		},

		getWaypointLocations: function(){
			var that = this;

			// return array of all  addresspicker LatLngs except first and last
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<3){ // less that 3 as start is fixed
				//no waypoints
				return [];
			};

			locations.shift(); //remove the first location as it is origin
			locations.pop(); //remove the last destination as it is dest

			return this.formatLocationsToWaypoints(locations);
		},

		getWaypointLocationsFixedStart: function(){
			var that = this;

			// return array of all  addresspicker LatLngs except last
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<2){
				//no waypoints
				return [];
			};

			// dont remove the first location in this case as it is a waypount
			locations.pop();  //remove the last destination as it is dest

			return this.formatLocationsToWaypoints(locations);
		},

		getWaypointLocationsReturnToBase: function(){
			var that = this;

			// return array of all  addresspicker LatLngs except first (which is already set as origin)
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<2){
				//no waypoints
				return [];
			};

			locations.shift(); //remove the first location as it is origin

			return this.formatLocationsToWaypoints(locations);
		},


		getWaypointLocationsReturnJourneyReturnToBase: function(){
			var that = this;

			// return array of all  addresspicker LatLngs except first (which is already set as origin)
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<2){
				//no waypoints
				return [];
			};
			var firstLocation = locations.shift(); //remove the first location as it is origin
			locations.push(firstLocation); // add first location to the end as it is a return journey 
			return this.formatLocationsToWaypoints(locations);
		},

		getWaypointLocationsReturnJourneyReturnToBaseFixedStart: function(){
			var that = this;

			// return array of all  addresspicker LatLngs except first (which is already set as origin)
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<2){
				//no waypoints
				return [];
			};
			// add first location to the end of waypoints as it is a return journey 
			var firstLocation = this.getFirstAddressPickerLocation(); 
			locations.push(firstLocation); 
			return this.formatLocationsToWaypoints(locations);
		},

		getWaypointLocationsReturnToBaseFixedStart: function(){
			var that = this;

			// return array of all  addresspicker LatLngs 
			var locations = this.getAllAddressPickerLocations();
			return this.formatLocationsToWaypoints(locations);
		},		

		getAllAddressPickerWaypoints: function(){
			// return array of all addresspicker waypoints
			var locations = this.getAllAddressPickerLocations();
			var waypoints = this.formatLocationsToWaypoints(locations);

			return waypoints;
		},

		getAddressPickerWaypointsReturnJourneyFixedStart: function(){
			// return array of all addresspicker waypoints
			var locations = this.getAllAddressPickerLocations();
			if(locations.length<2){
				//no waypoints
				return [];
			};
			var waypoints = this.formatLocationsToWaypoints(locations);

			return waypoints;
		},

		formatLocationsToWaypoints(locations){
			var that = this;
			var waypoints = [];
			$.each(locations, function (idx, location) {
				var waypoint = that.formatLocationToWaypoint(location);
				waypoints.push(waypoint);
			});	
			return waypoints;	
		},

		formatLocationToWaypoint(location){
			return {location: location,
					stopover:true};
		}
	};

}(jQuery));