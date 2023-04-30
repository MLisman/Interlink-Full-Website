/*	Google Maps Quote Calculatior 
*	jQuery Plugin from Creative Transmissions 
*	http://www.creativetransmissions.com/google-maps-quote-calculator-plugin
*	Author: Andrew van Duivenbode
* 	Liscence: MIT Liscence - See liscence.txt
*	TQPro v4.4
*/


; (function ($, window, document, undefined) {

	var map;

	// Create the defaults 
	var pluginName = "mapQuoteCalculator",
		defaults = {
					routeType: 'Fastest',
			countryCode: 'uk',
			debug: false,
			hideLegs: [],
			addressCmpNames: ['street_number', 'route', 'postal_town', 'administrative_area_level_2', 'administrative_area_level_1', 'country', 'postal_code', 'country'],
			addressPickerTemplate: function (data) {
				if (!data.idx) {
					return false;
				};

				var idx = data.idx;
				var html = '<div class="address-wrap">';
				html += '	<div class="field bt-flabels__wrapper full-width full">';
				html += '		<span class="sub_title"><i class="icon icon-icn-collection-address"></i>' + data.destinationAddressLabel + '</span><a href="#" class="remove-address no-address-' + idx + '">' + data.removeDestLinkText + '</a>';
				html += '		            <span class="transit_noadress no-address-inserted"><a href="#" class="transit_noadress no-address">' + data.cantFindAddressText + '</a></span>';
				html += '		<input class="text addresspicker" required type="text" name="address_' + idx + '_address" id="address_' + idx + '" value="" autocomplete="new-password" />';
				html += '		<span class="bt-flabels__error-desc">Required</span>';
				html += '	</div>';
				if (data.askForUnitNo === 'true') {
					html += '	<div class="inline-block bt-flabels__wrapper half left">';
					html += '		<input class="inline-block half-field" type="text" id="address_' + idx + '_appartment_no" name="address_' + idx + '_appartment_no" placeholder="' + data.unitNoLabel + '" value=""/>';
					html += '	</div>';
				};
				if (data.askForPostCode === 'true') {
					html += '	<div class="inline-block bt-flabels__wrapper half right last-address-field">';
					html += '		<input class="inline-block postcode half-field half-field-right" id="address_' + idx + '_postal_code" name="address_' + idx + '_postal_code" placeholder="Postcode" value=""/>';
					html += '	</div>';
				};
				html += '</div>';

				return html;
			},

			addressTemplateFirstIfFixedStartPos: function (data) {
				// final address picker has no via link
				if (!data.idx) {
					return false;
				};

				var idx = data.idx;

				var html = '<input class="addressTemplateFirstIfFixedStartPos" type="hidden" id="address_' + idx + '_street_number" name="address_' + idx + '_street_number" value=""/>';
				if (data.showInsertAddressPickerLink) {
					html += '<a href="#" class="add-waypoint" id="address_' + idx + '_add_waypoint">' + data.insertDestLinkText + '</a>';
				};
				html += '<input type="hidden" id="address_' + idx + '_route" name="address_' + idx + '_route" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_postal_town" name="address_' + idx + '_postal_town" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_2" name="address_' + idx + '_administrative_area_level_2" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_1" name="address_' + idx + '_administrative_area_level_1" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_country" name="address_' + idx + '_country" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lat" name="address_' + idx + '_lat" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lng" name="address_' + idx + '_lng" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_place_id" name="address_' + idx + '_place_id" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_journey_order" name="address_' + idx + '_journey_order" value="' + idx + '"/>';

				return html;
			},

			addressTemplate: function (data) {
				if (!data.idx) {
					return false;
				};

				var idx = data.idx;

				var html = '';
				if (data.showInsertAddressPickerLink) {
					html += '<a href="#" class="add-waypoint no-address-' + idx + '" id="address_' + idx + '_add_waypoint">' + data.insertDestLinkText + '</a>';
				};
				html += '<input class="addressTemplate" type="hidden" id="address_' + idx + '_street_number" name="address_' + idx + '_street_number" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_route" name="address_' + idx + '_route" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_postal_town" name="address_' + idx + '_postal_town" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_2" name="address_' + idx + '_administrative_area_level_2" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_1" name="address_' + idx + '_administrative_area_level_1" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_country" name="address_' + idx + '_country" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lat" name="address_' + idx + '_lat" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lng" name="address_' + idx + '_lng" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_place_id" name="address_' + idx + '_place_id" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_journey_order" name="address_' + idx + '_journey_order" value="' + idx + '"/>';

				return html;
			},

			addressTemplateLast: function (data) {
				// final address picker has no via link
				if (!data.idx) {
					return false;
				};

				var idx = data.idx;

				var html = '<input class="addressTemplateLast" type="hidden" id="address_' + idx + '_street_number" name="address_' + idx + '_street_number" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_route" name="address_' + idx + '_route" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_postal_town" name="address_' + idx + '_postal_town" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_2" name="address_' + idx + '_administrative_area_level_2" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_administrative_area_level_1" name="address_' + idx + '_administrative_area_level_1" value=""/>';
				html += '<input type="hidden" requried id="address_' + idx + '_country" name="address_' + idx + '_country" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lat" name="address_' + idx + '_lat" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_lng" name="address_' + idx + '_lng" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_place_id" name="address_' + idx + '_place_id" value=""/>';
				html += '<input type="hidden" id="address_' + idx + '_journey_order" name="address_' + idx + '_journey_order" value="' + idx + '"/>';

				return html;
			},

			accumulateDistanceCost: false,
			autoTest: false,
			defaultServiceId: 's_1',
			defaultVehicleId: 1,
			// fare calculation options
			surcharge: 0, // inital cost before calculation
			units: 'imperial', // metric or imperial
			minNotice: false,
			minNoticeCharge: 0,
			minCost: 0,
			minDistance: 0,

			// Discount
			discountType: 'amount',
			discountAmount: 0,
			pickStartAddress: true,
			noAddressPickers: 2,
			maxAddressPickers: 10,
			draggableMarker: false, // Allow the user to drag the marker to a location as well as search

			maxTestJourneyLength: 255,
			testJourneyIncrement: 5,
			transportationMode: 'DRIVING',
			showRoute: true, //use google directions to display the route
			/*	
				The form elements tell the plugin which html inputs are used for 
				entering the addresses and diplaying the reuslts 

				You can also use them to put the information into form fields so you can save them to your server
			*/

			// Required Form Elements 
			pickUpInput: 'address_0', // The id of the text input for the pick up address
			dropOffInput: 'address_1',  // The id of the text input for the drop off address

			quoteResult: 'quote-element', //The id of the text input or html element for displaying the quote
			distance: 'distance', //The id of the text input or html element for displaying the distance					
			hours: 'hours',  //The id of the text input or html element for displaying estimated travel time
			time: 'time',
			// Optional Form Elements - Pick Up Address details in Google's data format
			pickUpAdminAreaLevel2: 'address_0_administrative_area_level_2',
			pickUpAdminAreaLevel1: 'address_0_administrative_area_level_1',
			pickUpCountry: 'address_0_country',
			pickUpPostalCode: 'address_0_postal_code',

			// Optional Form Elements - Drop Off Up Address details in Google's data format
			dropOffAdminAreaLevel2: 'address_1_administrative_area_level_2',
			dropOffAdminAreaLevel1: 'address_1_administrative_area_level_1',
			dropOffCountry: 'address_1_country',
			dropOffPostalCode: 'address_1_postal_code',

			// Optional Form Elements - Latitude and Longitude coordinates for addresses
			pickUpLat: 'address_0_lat',
			pickUpLng: 'address_0_lng',

			dropOffLat: 'address_1_lat',
			dropOffLng: 'address_1_lng',

			timepickerSelector: 'collection_time',
			datepickerSelector: 'collection_date'
		};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.geocoder = new google.maps.Geocoder();
		this.mapId = this.element.id;
		this.pickUpPos = '';
		this.dropOffPos = '';
		this.addressPickers = [];

		this.init();
	}

	Plugin.prototype = {

		/* initialization code */
		init: function () {
			var that = this;
			if (this.autoTest) {
				$('#test-message').show();
			} else {
				$('#test-message').hide();
			};
			this.initData()
			that.initUI();
			that.initEvents();
			if (this.settings.geolocate === true) {
				this.log('geoLocateUser');
				this.geoLocateUser(function (position) {
					//update map position
					that.setCenterLatLng(position.coords.latitude, position.coords.longitude);
				});
			};
			if (this.settings.autoTest) {
				this.runAutoTest();
			};
			this.log('pickStartAddress: ' + this.settings.pickStartAddress);
 		},

		initData: function () {
			this.routeIsPossible = false;
			this.setUnits();
			this.setTransportationMode();
			this.getDateTime();
			this.getHolidays();
		},

		setTransportationMode: function () {
			switch (this.settings.transportationMode) {
				case 'Driving':
					this.travelMode = google.maps.TravelMode.DRIVING;
					break;
				case 'Cycling':
					this.travelMode = google.maps.TravelMode.BICYCLING;
					break;
				case 'Walking':
					this.travelMode = google.maps.TravelMode.WALKING;
					break;
				case 'Public Transport':
					this.travelMode = google.maps.TravelMode.TRANSIT;
					break;
				default:
					this.travelMode = google.maps.TravelMode.DRIVING;
					break;
			}
		},

		initUI: function () {

			this.initMap();
			this.initMapUI();
			this.initMapElements();
			this.initFormElements();

		},

		initMapElements: function () {
			var that = this;

			this.addressPickers = [];
			this.pickerConfig = this.setPickerConfig();
			if (this.settings.pickStartAddress === 'false') {
				var startAddressIdx = 1; //start at address input address_0
			//	this.initFixedStartPosUI();
			} else {
				var startAddressIdx = 0;  //start at address input address_1
			//	this.initUserDefinedStartPosUI();
			};

			var addrespickerInputs = this.getAddressPickerInputsFromPage();

			$.each(addrespickerInputs, function(idx, picker){
				var config = $.extend({
					inputElId: 'address_'+String((startAddressIdx+idx)),
				}, that.pickerConfig);

				that.createAddressPicker(config);

			})
			/* always init the destination picker
			var dropOffAddressPickerConfig = $.extend({
				inputElId: this.settings.dropOffInput
			}, this.pickerConfig);
			console.log('this.settings.dropOffInput: '+this.settings.dropOffInput);
			this.createAddressPicker(dropOffAddressPickerConfig);*/


		},

		setPickerConfig: function () {
			var that = this;

			//default config for AddressPickers
			var pickerConfig = {
				countryCode: this.settings.countryCode,
				returnToBase: this.settings.returnToBase,
				restrictToCountry: this.settings.restrictToCountry,
				searchRadius: this.settings.searchRadius,
				draggableMarker: this.settings.draggableMarker,
				geocoder: this.geocoder,
				map: this.map,
				mapOptions: this.getMapOptions(),
				// if startPlaceName is set then add a marker with the location in a popup
				markerVisible: false,
				location: this.getBusinessLocation(),
				placeChangeCallback: function (picker, place, addressIndex) {
					// If the place has a geometry, then present it on a map.
					if (place.geometry.viewport) {
						that.map.fitBounds(place.geometry.viewport);
					} else {
						//zoom and center to location
						//that.map.setCenter(place.geometry.location);
						//that.map.setZoom(17);
					};

					//clear directions and quote
					that.clearFeedback();
					that.clearJourneyData();					
					that.clearQuote();
					
					//update form with location data
					// that.updateForm(addressType, place.address_components);
					that.clearRepeatCustomerAddress(addressIndex);
					that.updateFormHiddenAddressFields(addressIndex, place.address_components);
					that.updateFormHiddenLatLng(addressIndex, picker.getPos());
					that.updateFormHiddenPlaceId(addressIndex, picker.getPlaceId());

					if(that.settings.afterPlaceChangeCallback){
						that.settings.afterPlaceChangeCallback(picker);
					};

					if(that.routeIsValid()){
						that.processRoute();
					};
				}
			};

			return pickerConfig;
		},

		routeIsValid: function(){
			if (!this.consecutiveAddressesAreDifferent()) {
				this.displayFeedback('It is not possible to travel to the same address twice in a row.');
				return false;
			};
			if (!this.hasTwoAddresses()) {
				return false;
			};
			if (!this.hasAllAddresses()) {
				return false;
			};

			if (this.addressPickers.length === 2) {
				// if only 2 addresses, they must be different
				if (!this.startAndEndAddressesAreDifferent()) {
					this.displayFeedback('Start Address cannot be the same as End Address. Please select Deliver and Return to return to the start location at the end of the journey.');
					return false;
				};
			};	
			return true;		
		},

		processRoute: function(){
			var that = this;
			this.journeyType = this.determinJourneyType();
			//console.log('this.journeyType: '+this.journeyType);
			this.requestDirections({
				callbackSuccess: function(directionsResponse){

					// copy response before saving
					var unFilteredResponse = JSON.stringify(directionsResponse);
					var unFilteredResponse = $.parseJSON(unFilteredResponse);

					var routeData = that.parseDirectionsResponse(unFilteredResponse);					
					that.storeRouteData(routeData);	

					//update the quote (needs refatored)
					that.updateQuote();

					if(that.settings.afterQuote){
						that.settings.afterQuote(routeData);
					};

					//filter legs that we dont want to display
					var filteredDirectionsResponse = that.filterLegs(directionsResponse);
					that.displayRoute(filteredDirectionsResponse);

				},

				callbackFailure: function(directionsResponse){
					that.routeIsPossible = false;
					that.log('Google Maps API Error: ' + status);
					that.log(directionsResponse);
					that.displayFeedback("No route available");
					$('.transit_inner.quote-fields').hide();
					$('.transit_inner.contact').hide();
					// if(that.settings.returnToBase == 'false'){
					// 	that.displayFeedback('There are no driving directions available for the route you have selected.<br/>Please ensure that it is possible to drive between these locations.')
					// } else {
					// 	that.displayFeedback('There are no driving directions available for the route you have selected.<br/>Please ensure that it is possible to drive between our business address and these locations.')
					// }

					// that.displayFeedback('We were unable to find a route between the selected locations.<br/>Please check this your journey is possible by road.')

					that.log('no waypoints: ' + that.waypoints);
					$.each(this.waypoints, function (idx, waypoint) {
						that.log(waypoint);
						that.log(waypoint.location.lat());
						that.log(waypoint.location.lng());
					})					

				}
			});
			

		},

		parseDirectionsResponse: function(response){

			this.routeIsPossible = true;

			//get useful data
			if(response.routes.length === 1){
				//there is only one possible route
				var distanceDuration = this.getDistanceDurationFromLegs(response.routes[0].legs);
				var directionsResponse = {index: 0,
									distanceDuration: distanceDuration};				
			} else {
				var directionsResponse = this.chooseRoute(response);
			};
			this.routeIndex = directionsResponse.index;

			var distanceDuration = directionsResponse.distanceDuration;
			var durationSecs = distanceDuration.totalDuration; //secs
			var distance = distanceDuration.totalDistance; //Meters
			var durationText = this.convertDurationToText(durationSecs);
			var durationHours = this.convertDurationSecsToHours(durationSecs);

			var distanceKm = distance / 1000;
			var miles = distanceKm / 1.609;
			var processedResponseData = {
				response: response,
				distance: distance,
				distanceKm: distanceKm,
				miles: miles,
				duration: durationText,
				durationHours: durationHours,
				durationText: durationText,
				journeyType: this.journeyType
			};
			return processedResponseData;
		},

		determinJourneyType: function(){

			var routeType = 'StandardJourney';

			if(this.isReturnToBase()){
				routeType = 'ReturnToBase';			
			};

			if( (this.isReturnToCollection())||(this.isReturnJourney()) ){
				routeType = 'ReturnJourney';
			};

			if( (this.isReturnToBase()) && (this.isReturnJourney()) ){
				routeType = 'ReturnJourneyReturnToBase';
			};

			if(this.isFixedStart()){
				routeType += 'FixedStart';
			};

			if(this.isMixedTranportMode()){
				routeType += 'MixedMode';
			};

			return routeType;

		},

		isReturnJourney: function () {
			var deliverAndReturnInputType = $('input[name="deliver_and_return"]').attr('type');
			switch (deliverAndReturnInputType) {
				case 'checkbox':
					var deliverReturn = $('input[name="deliver_and_return"]').is(':checked');
					break;				
				case 'hidden':
					var deliverReturn = $('input[name="deliver_and_return"]').val();
					break;
				case 'radio':
					var deliverReturn = $('input[name="deliver_and_return"]:checked').val();
					break;
			};

			if (deliverReturn == 1) {
				return true;
			} else {
				return false;
			};
		},

		isReturnToCollection: function(){
			var returnToCollectionIsEnabled = (this.settings.returnToCollection === 'true');
			var deliverAndReturnIsSelected = this.isReturnJourney();
			var isReturnToCollection = (returnToCollectionIsEnabled && deliverAndReturnIsSelected);
			return isReturnToCollection;
		},

		isReturnToBase: function(){
			return (this.settings.returnToBase === 'true');
		},

		isFixedStart: function () {
			isFixedStart = (this.settings.pickStartAddress === 'false');
			//console.log('***isFixedStart: ', isFixedStart);
			//console.log('***pickStartAddress: ', this.settings.pickStartAddress);

			return isFixedStart;
		},

		isMixedTranportMode: function(){
			return false;
		},

		isOptimizingRoute: function () {
			var optimizeRouteInput = $('input[name="optimize_route"]');
			if (optimizeRouteInput.length === 0) {
				return false;
			};
			var optimizeRouteInputType = $('input[name="optimize_route"]').attr('type');
			switch (optimizeRouteInputType) {
				case 'hidden':
					var optimizeRoute = $('input[name="optimize_route"]').val();
					break;
				case 'radio':
					var optimizeRoute = $('input[name="optimize_route"]:checked').val();
					break;
			};

			if (optimizeRoute == 1) {
				return true;
			} else {
				return false;
			};
		},

		getRouteOptionsforRouteType: function(){

			var routePickerConfig = {addressPickersObjects: this.addressPickers};
			var routeAddressPickers =  new $.fn.RouteAddressPickers(routePickerConfig);
			var formReader = new $.fn.FormReader({formId: 'quote-form'});

			var defaultOptions = {
				routeAddressPickers: routeAddressPickers,
				optimizeWaypoints: formReader.getIsOptimizingWaypoints()
			};

			//add
			var defaultOptionsForFixedStart = $.extend(defaultOptions, {
				startLat: this.settings.map.startLat,
				startLng: this.settings.map.startLng
			});

			this.log('this.journeyType: '+this.journeyType);
			switch(this.journeyType){
				case 'StandardJourney':
					var routeOptionsBuilder = new $.fn.StandardRouteOptionsBuilder(defaultOptions);
				break;
				case 'StandardJourneyFixedStart':
					var routeOptionsBuilder = new $.fn.StandardFixedStartRouteOptionsBuilder(defaultOptionsForFixedStart);
					this.settings.hideLegs = ['dispatch'];					
				break;
				case 'ReturnJourney':
					var routeOptionsBuilder = new $.fn.ReturnJourneyRouteOptionsBuilder(defaultOptions);
				break;
				case 'ReturnJourneyFixedStart':
					var routeOptionsBuilder = new $.fn.ReturnJourneyFixedStartRouteOptionsBuilder(defaultOptionsForFixedStart);
					this.settings.hideLegs = ['dispatch'];
				break;
				case 'ReturnToBase':
					var routeOptionsBuilder = new $.fn.ReturnToBaseOptionsBuilder(defaultOptionsForFixedStart);				
					this.settings.hideLegs = ['return_to_base'];
				break;				
				case 'ReturnToBaseFixedStart':
					var routeOptionsBuilder = new $.fn.ReturnToBaseFixedStartRouteOptionsBuilder(defaultOptionsForFixedStart);				
					this.settings.hideLegs = ['dispatch', 'return_to_base'];
				break;
				case 'ReturnJourneyReturnToBase':
					var routeOptionsBuilder = new $.fn.ReturnJourneyReturnToBaseOptionsBuilder(defaultOptionsForFixedStart);				
					this.settings.hideLegs = ['return_to_base'];
				break;					
				case 'ReturnJourneyReturnToBaseFixedStart':
					var routeOptionsBuilder = new $.fn.ReturnJourneyReturnToBaseFixedStartOptionsBuilder(defaultOptionsForFixedStart);				
					this.settings.hideLegs = ['dispatch', 'return_to_base'];
				break;		

				case 'StandardJourneyMixedMode':
					var routeOptionsBuilder = new $.fn.StandardMixedModeRouteOptionsBuilder(defaultOptions);							
				break;
				case 'StandardJourneyFixedStartMixedMode':
					var routeOptionsBuilder = new $.fn.StandardFixedStartMixedModeRouteOptionsBuilder(defaultOptionsForFixedStart);												
				break;
				case 'ReturnJourneyMixedMode':
					var routeOptionsBuilder = new $.fn.ReturnJourneyMixedModeRouteOptionsBuilder(defaultOptions);
				break;
				case 'ReturnJourneyFixedStartMixedMode':
					var routeOptionsBuilder = new $.fn.ReturnJourneyFixedStartMixedModeRouteOptionsBuilder(defaultOptionsForFixedStart);
					this.settings.hideLegs = ['return_to_collection'];
				break;				
			};

			return routeOptionsBuilder.buildRouteOptions();

		},

		requestDirections: function(options){
			var routeRequest = new $.fn.RouteRequest(options);
			this.routeOptions = this.getRouteOptionsforRouteType();
			console.log("routeRequest", routeRequest)
			/*console.log('start: '+this.routeOptions.origin.lat(), ',',this.routeOptions.origin.lng());
			
			$.each(this.routeOptions.waypoints, function(idx, waypoint){
				console.log(waypoint);
				console.log('waypoint: '+waypoint.location.lat(), ',',waypoint.location.lng());
			});
			console.log('destination: '+this.routeOptions.destination.lat(), ',',this.routeOptions.destination.lng());
			*/
			if(!routeRequest.optionsAreValid(this.routeOptions)){
				return false;
			};			

			routeRequest.requestRoute(this.routeOptions);
		},


		storeRouteData: function(directionsResponse){
		
			//store response 
			this.setMapData(directionsResponse);


		},
						
		initFixedStartPosUI: function () {
			this.setPickUpPointToStartLocation();

			this.log('pickUpPos set from startlat: ' + this.settings.map.startLat + ' and start lng: ' + this.settings.map.startLng);
			this.log(this.pickUpPos.lat());
			this.log(this.pickUpPos.lng());
			if (this.settings.startPlaceName) {
				// if startPlaceName is set then add a marker with the location in a popup
				this.pickUpMarker = this.initMarker({
					visible: true,
					position: this.pickUpPos
				});
			} else {
				this.pickUpMarker = this.initMarker({
					visible: false,
					position: this.pickUpPos
				});
			};
		},

		initUserDefinedStartPosUI: function () {
			this.pickUpInput = $('#' + this.settings.pickUpInput);
			var pickupPickerConfig = $.extend({
				inputElId: this.settings.pickUpInput,
				markerVisible: (this.settings.startPlaceName) ? true : false,
				startPlaceName: this.settings.startPlaceName,
				pos: this.pickUpPos,
			}, this.pickerConfig);

			this.createAddressPicker(pickupPickerConfig);
		},

		setPickUpPointToStartLocation: function () {
			// default pick up pos to map center
			var mapCenterPos = new google.maps.LatLng(this.settings.map.startLat, this.settings.map.startLng);
			this.pickUpPos = mapCenterPos;
			this.log('pickUpPos set from startlat: ' + this.settings.map.startLat + ' and start lng: ' + this.settings.map.startLng);
			this.log(this.pickUpPos.lat());
			this.log(this.pickUpPos.lng());
		},

		initMarker: function (markerOptions) {

			var markerOptions = (markerOptions) ? markerOptions : {};
			var mapOptions = this.getMapOptions();
			this.log(markerOptions);
			var markerOptions = $.extend({
				anchorPoint: new google.maps.Point(0, -29),
				draggable: this.settings.draggableMarker,
				map: this.map,
				position: mapOptions.center,
				visible: this.settings.markerVisible
			}, markerOptions);

			var marker = new google.maps.Marker(markerOptions);
			marker.setIcon({
				url: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			});
			return marker;
		},

		logRoute: function () {
			console.log('logRoute Pick Up:');
			console.log(this.pickUpPos.lat());
			console.log(this.pickUpPos.lng());
			if (this.waypoints) {
				console.log(this.userWaypoints.length + ' waypoints.');
				$.each(this.userWaypoints, function (idx, waypoint) {
					console.log(waypoint.place);
					console.log(waypoint.location.lat());
					console.log(waypoint.location.lng());
				});
			};
			console.log('logRoute Drop Off:');

			console.log(this.dropOffPos.lat());
			console.log(this.dropOffPos.lng());
		},

		createAddressPicker: function (config) {
			var that = this;
			var addressPicker =  new $.fn.AddressPicker(config);
			this.addressPickers.push(addressPicker);
			var newAddressPickerIndex = this.getAddresPickerIndexFromId(config.inputElId);
			addressPicker.setIndex(newAddressPickerIndex);
			addressPicker.init();			
			// https://blog.woosmap.com/implement-and-optimize-autocomplete-with-google-places-api
			// const displaySuggestions = function (predictions, status) {
			// 	if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
			// 		// alert("No address found!");
			// 		// return;
			// 	}
			//   };
			// var selector = addressPicker.inputEl.selector.substring(1, addressPicker.inputEl.selector.length);
			// document.getElementById(selector).addEventListener('input', this.debounce(function() {
			// 	let autocompleteService = new google.maps.places.AutocompleteService();
			// 	let value = this.value;
			// 	autocompleteService.getPlacePredictions({
			// 		input: value
			// 	  }, displaySuggestions);
			// }, 150));

			return addressPicker;
		},

		// debounce: function(func, wait, immediate) {
		// 	var timeout;
		// 	return function() {
		// 		var context = this, args = arguments;
		// 		var later = function() {
		// 			timeout = null;
		// 			if (!immediate) func.apply(context, args);
		// 		};
		// 		var callNow = immediate && !timeout;
		// 		clearTimeout(timeout);
		// 		timeout = setTimeout(later, wait);
		// 		if (callNow) func.apply(context, args);
		// 	};
		// },
		getAddresPickerIndexFromId: function (inputElId) {
			var idParts = inputElId.split('_');
			return (idParts[1]) ? idParts[1] : false;
		},

		initMapUI: function () {
			//this.addKMLLayers();
			//this.addLayers();
		},

		addElements: function () {
			var that = this;
			var addressWraps = $('.search-fields .address-wrap');
			var noAddressWraps = addressWraps.length;
			var showInsertAddressPickerLink = (that.addressPickers.length < that.settings.maxAddressPickers);
			$(addressWraps).each(function (idx, el) {
				var addressPickerIdx = idx;
				if (that.settings.pickStartAddress === 'false') {
					addressPickerIdx = idx + 1;
				};

				if (idx > 0) {

					//after the first addresspicker               
					showInsertAddressPickerLink = (that.addressPickers.length < that.settings.maxAddressPickers);

					var templateData = {
						idx: String(addressPickerIdx),
						insertDestLinkText: that.settings.insertDestLinkText,
						removeDestLinkText: that.settings.removeDestLinkText,
						showInsertAddressPickerLink: showInsertAddressPickerLink,
						destinationAddressLabel: that.settings.destinationAddressLabel,
						cantFindAddressText: that.settings.cantFindAddressText,
						unitNoLabel: that.settings.unitNoLabel
					};

					if ((1 + idx) === that.addressPickers.length) {
						//last picker so last template
						$(el).append(that.settings.addressTemplateLast(templateData));
					} else {
						$(el).append(that.settings.addressTemplate(templateData));
					};


				} else {
					//the first addresspicker
					var templateData = {
						idx: String(addressPickerIdx),
						insertDestLinkText: that.settings.insertDestLinkText,
						removeDestLinkText: that.settings.removeDestLinkText,
						showInsertAddressPickerLink: showInsertAddressPickerLink,
						destinationAddressLabel: that.settings.destinationAddressLabel,
						cantFindAddressText: that.settings.cantFindAddressText,
						unitNoLabel: that.settings.unitNoLabel
					};

					var repeatCustomerEl = $(".search-fields.repeat-customer");
					if (repeatCustomerEl.length === 0) {
						// just append hidden fields if lat lng not available for collection address first time
						$(el).append(that.settings.addressTemplate(templateData));
					}
				};

			});

		},

		addLayers: function () {
			var that = this;
			if (!this.settings.layers) {
				return false;
			};

			var mapControls = this.map.controls[google.maps.ControlPosition.TOP_RIGHT];
			//loop through layer configs
			$.each(this.settings.layers, function (idx, layer) {

				//add layer an return control
				var layerControl = that.addKMLLayer(layer);

				//add index
				layerControl.index = mapControls.length;

				//add to controls array
				mapControls.push(layerControl);
			});
			return true;
		},

		addKMLLayer: function (layer) {
			var that = this;
			var div = document.createElement('div');

			var name = layer.name;
			var label = layer.label;
			var startStatus = layer.status;

			div.style.margin = '5px';
			div.style.backgroundColor = 'white';
			div.style.color = 'black';
			div.style.borderStyle = 'solid';
			div.style.borderWidth = '1px';
			div.style.borderColor = 'lightgray';
			div.style.cursor = 'pointer';
			div.style.textAlign = 'center';
			div.style.fontFamily = 'Arial,sans-serif';
			div.style.fontSize = '12px';
			div.style.paddingLeft = '6px';
			div.style.paddingRight = '6px';
			div.style.paddingTop = '2px';
			div.style.paddingBottom = '2px';
			if (startStatus === 1) {
				div.innerHTML = '<b>' + label + ':</b> On';
			} else {
				div.innerHTML = '<b>' + label + ':</b> Off';
			}


			var status = startStatus;

			switch (name) {
				case 'BicyclingLayer':
					that.bicyclingLayer = new google.maps.BicyclingLayer();
					that.bicyclingLayer.setMap(this.map);
					that.initLayerControlEvent(div, that.bicyclingLayer, status, name, label);
					break;
				case 'TrafficLayer':
					that.trafficLayer = new google.maps.TrafficLayer();
					that.trafficLayer.setMap(this.map);
					that.initLayerControlEvent(div, that.trafficLayer, status, name, label);
					break;
				case 'TransitLayer':
					that.transitLayer = new google.maps.TransitLayer();
					that.transitLayer.setMap(this.map);
					that.initLayerControlEvent(div, that.transitLayer, status, name, label);
					break;
				default:
					//current support only for a single kml layer and not tested
					that.kmlLayer = that.displayKml(name);
					that.initKmlControlEvent(div, that.kmlLayer, status, name)
					break;
			};



			return div;
		},

		clearRepeatCustomerAddress: function (addressIndex) {
			// only in use when we can select repeat customers
			var selectElId = '#select_address_' + String(addressIndex);
			$(selectElId).val('');
		},

		displayKml: function (fileName) {

			var url = fileName;

			var layer = new google.maps.KmlLayer({
				url: url
			});

			layer.setMap(this.map);
			return layer;
		},

		filterAvailableVehicles: function () {
			var that = this;

			// is there a vehicle selection in use
			if (!this.selectVehicleEl) {
				return false;
			};

			this.serviceType = this.getSelectedServiceType();
			// get service rates
			var vehiclesWithRatesForService = this.getRatesForService();

			// hide all vehicle select options
			this.hideVehicleSelectOptions();

			// loop through service rates
			$.each(vehiclesWithRatesForService, function (idx, vehicleId) {

					// get option for vehicle id and show it
				$('option[value="' + vehicleId + '"]', that.selectVehicleEl).show();
			});
			//$('#vehicle_id option[value='+vehiclesWithRatesForService[0]+']').prop('selected', true);
			return vehiclesWithRatesForService;

		},

		getRatesForService: function(){
			var service_id =  this.serviceType.split('_')[1];
			var filteredArray = this.settings.rates.filter(function(rate){
			  return (rate.service_id == service_id);
			});

			var vehicleIds = filteredArray.map(function(obj) { return obj.vehicle_id; });
			vehicleIds = vehicleIds.filter((item, i, ar) => ar.indexOf(item) === i);
			return vehicleIds;	
		},

		getCurrentTime: function () {
			var that = this;
			//get current time from javascript
			var dateTime = new Date();
			var time = dateTime.getHours() + ':' + dateTime.getMinutes();
			return time;
		},

		getStartPosition: function () {
			if (this.settings.pickStartAddress === 'true') {
				this.log('getStartPosition: get pickup pos from addresspicker');
				return this.addressPickers[0].getPos();
			} else {
				this.log('getStartPosition: get pickup pos from default start position');
				return new google.maps.LatLng(this.settings.map.startLat, this.settings.map.startLng);

			};
		},

		getBusinessLocation: function () {
			return new google.maps.LatLng(this.settings.map.startLat, this.settings.map.startLng);
		},

		getBusinessLocationString: function () {

			return this.settings.map.startLat + ',' + this.settings.map.startLng;
		},

		getLastDestinationPos: function () {
			var addressPickerInputIndex = this.addressPickers.length - 1;
			return this.addressPickers[this.addressPickers.length - 1].getPos();
		},

		getStartPlaceId: function () {
			if (this.settings.pickStartAddress === 'true') {
				this.log('getStartPlaceId: get pickup pos from addresspicker');
				return this.addressPickers[0].getPlaceId();
			};
		},

		getLastPlaceId: function () {
			var addressPickerInputIndex = this.addressPickers.length - 1;
			return this.addressPickers[this.addressPickers.length - 1].getPlaceId();
		},

		getServerTime: function (callback) {
			var that = this;
			//get local time from sever

			var data = { action: 'get_server_time' };
			$.post(this.settings.ajaxUrl, data, function (response) {
				if (response.serverTime) {
					that.serverTime = response.serverTime;
				} else {
					that.serverTime = false;
				};
				if (callback) {
					callback(response);
				}
			}, 'json');

		},

		hideMinCostMessage: function () {
			$('.min-cost-msg').hide();
		},

		hideMinDistanceMsg: function () {
			$('.min-distance-msg').hide();
		},

		hideVehicleSelectOptions: function () {
			$('option', this.selectVehicleEl).hide();
		},

		initKmlControlEvent: function (div, layer, status, name) {
			var that = this;

			//Set up click event for control
			google.maps.event.addDomListener(div, 'click', function () {
				if (status == 0) {
					that.displayKml(name);
					status = 1;
					div.innerHTML = '<b>' + label + ':</b> On';
				} else {
					that.hideKml(name);
					status = 0;
					div.innerHTML = '<b>' + label + ':</b> Off';
				}
			});
		},

		initLayerControlEvent: function (div, layer, status, name, label) {
			var that = this;

			//Set up click event for control
			google.maps.event.addDomListener(div, 'click', function () {
				if (status == 0) {
					layer.setMap(that.map);
					status = 1;
					div.innerHTML = '<b>' + label + ':</b> On';
				} else {
					layer.setMap(null);
					status = 0;
					div.innerHTML = '<b>' + label + ':</b> Off';
				}
			});
		},

		initFormElements: function () {
			this.addElements();
			this.getFormRefs();
			this.setFormDefaults();
		},

		initEvents: function () {
			this.initPageEvents();
			this.initMapEvents();
		},

		initMapEvents: function () {
			var that = this;
			//events for map object
			this.map.addListener('mousedown', function (e) {
				that.clickMap(e);
			});

		},

		addAddressPicker: function (insertDestinationAnchorElement) {
			// add address picker to form after clicking insert address

			// add html
			var addressPickerInputIndex = this.getNewAddressPickerIndex();
			this.insertAddressPickerHtml(addressPickerInputIndex, insertDestinationAnchorElement);
			// init google maps autocomplete
			var addressPickerInputId = 'address_' + String(addressPickerInputIndex);
			var newAddressPickerConfig = $.extend({
				inputElId: addressPickerInputId
			}, this.pickerConfig);

			this.createAddressPicker(newAddressPickerConfig);
			$('#' + addressPickerInputId).focus();
			this.updateJourneyOrder();
			$('.tq-form input').keypress(function (event) { return event.keyCode != 13; });
		},

		addDiscount: function (type, amount) {

			// Validate type
			type = type.toLowerCase();
			var acceptedTypes = ['amount', 'percent'];
			var typeIsValid = acceptedTypes.indexOf(type) !== -1

			// Validate amout
			var amountIsValid = $.isNumeric(amount);

			// Add discount
			if (typeIsValid && amountIsValid) {
				this.discountType = type;
				this.discountAmount = amount;
			} else {
				this.addDiscount('amount', 0);
			}
		},

		isRoutePossible: function () {
			var that = this;
			that.log('isRoutePossible');
			if(!this.hasTwoAddresses()){
				return false;
			};
			if (!this.routeIsPossible) {
				return false;
			};
			return true;
		},

		hasTwoAddresses: function () {
			var pickUpPos = this.getStartPosition();
			var dropOffPos = this.getLastDestinationPos();
			if (!pickUpPos) {
				this.log('no pickUpPos');
				return false;
			};
			if (!dropOffPos) {
				this.log('no dropOffPos');
				return false;
			};
			return true;
		},

		hasAllAddresses: function () {
			var isValid = true;
			$.each(this.addressPickers, function (idx, addressPicker) {
				var address = addressPicker.getAddress();
				if(address==''){
					isValid = false;
				};
			});
			return isValid;
		},		

		startAndEndAddressesAreDifferent: function () {
			var startPlaceId = this.getStartPlaceId();
			var lastPlaceId = this.getLastPlaceId();

			if (startPlaceId === lastPlaceId) {
				return false;
			} else {
				return true;
			}
		},

		consecutiveAddressesAreDifferent: function () {
			var that = this;
			var thisPlaceId = null;
			var previousPlaceId = null;
			var thisPlaceIdx = null;
			var previousPlaceIdx = null;
			var areDifferent = true;
			var errorMsg = '';
			$.each(this.addressPickers, function (idx, addressPicker) {
				thisPlaceId = addressPicker.getPlaceId();
				thisPlaceIdx = idx;
				if (thisPlaceId === previousPlaceId) {
					areDifferent = false;
					return false;
				};
				previousPlaceId = addressPicker.getPlaceId();
				previousPlaceIdx = idx;
			});
			return areDifferent;
		},

		calcDuration: function (duration) {

			//convert googles text response into numbers we can work with
			var durationArray = duration.split(' ');

			//Deal with response differently as array is spilt into hours and mins
			switch (durationArray.length) {
				case 2:
					var totalMins = parseInt(durationArray[0]);
					break;
				case 4:
					var hours = parseInt(durationArray[0]);
					var mins = parseInt(durationArray[2]);
					//Multiply hour part by 60 and add the mins
					var totalMins = (hours * 60) + mins;
					break;
			}

			//Divide total mins by 60 to get hours
			totalHours = this.round(totalMins / 60);
			return totalHours;

		},

		calculateRoute: function (options) {
			if (this.settings.showRoute) {
				var api = 'directions';
			} else {
				var api = 'distance';
			};
			switch (api) {
				case 'distance':
					this.callDistanceMatrix(options.callback);
					break;
				case 'directions':
					this.callDirections(options);
					break;
			};
		},

		setReturnJourney: function () {

		},

		populateReturnJourneyFields: function (data) {
			$('input[name="return_distance"]').val(data.distance);
			$('input[name="return_time"]').val(data.durationHours);
		},

		chooseRoute: function(response){
			if(this.settings.routeType === 'Shortest'){
				var directionsResponse = this.getShortestRoute(response.routes);
			} else {
				fastestDistanceDuration = this.getDistanceDurationFromLegs(response.routes[0].legs);
				var directionsResponse = {index: 0,
									distanceDuration: fastestDistanceDuration};
			};
			return directionsResponse;
		},

		getShortestRoute: function(routes){
			var that = this;
			var shortestRouteLength = null;
			var shortestRouteIndex = 0;
			var shortestDistanceDuration = null;
			$.each(routes, function(idx, route){
				var legs = route.legs;
				var distanceDuration = that.getDistanceDurationFromLegs(legs);
				if((!shortestRouteLength)||(distanceDuration.totalDistance < shortestRouteLength)){
					shortestRouteLength = distanceDuration.totalDistance;
					shortestRouteIndex = idx;
					shortestDistanceDuration = distanceDuration;
				};
			});
			return {index: shortestRouteIndex,
					distanceDuration: shortestDistanceDuration};

		},


		hideAllMarkers: function () {
			$.each(this.addressPickers, function (idx, addressPicker) {
				addressPicker.hideMarker();
				addressPicker.hideInfoWindow();
			});
		},


		getDistanceDurationFromLegs: function (legs) {
			var totalDistance = 0;
			var totalDuration = 0;
			for (var i = 0; i < legs.length; ++i) {
				totalDistance += legs[i].distance.value;
				totalDuration += legs[i].duration.value;
			}
			return {
				totalDuration: totalDuration,
				totalDistance: totalDistance
			};
		},

		convertDurationToText: function (durationSecs) {
			var date = new Date(null);
			date.setSeconds(durationSecs);
			dateString = date.toISOString().substr(11, 8);
			var dateStringParts = dateString.split(':');
			if (parseInt(dateStringParts[0]) > 0) {
				dateString = parseInt(dateStringParts[0]) + ' hrs ';
			} else {
				dateString = '';
			};

			if (parseInt(dateStringParts[1]) > 0) {
				dateString += parseInt(dateStringParts[1]) + ' mins';
			};

			return dateString;
		},

		convertDurationSecsToHours: function (durationSecs) {
			var durationMins = durationSecs / 60;
			var durationHours = durationMins / 60;
			durationHours = this.round(durationHours);
			return durationHours;
		},

		checkMinDistance: function (data) {
			if (!this.settings.minDistance) {
				return true;
			};

			if (parseFloat(data.distance) < parseFloat(this.settings.minDistance)) {
				this.showWarnings();
				this.showMinDistanceMsg();
				return false;
			} else {
				//clear message
				this.hideWarnings();
				this.hideMinDistanceMsg();
				return true;
			};

		},

		checkMaxDistance: function (data) {
			if (!this.settings.maxDistance) {
				return true;
			};

			if (parseFloat(data.distance) > parseFloat(this.settings.maxDistance)) {
				this.showWarnings();
				this.showMaxDistanceMsg();
				return false;
			} else {
				//clear message
				this.hideWarnings();
				this.hideMaxDistanceMsg();
				return true;
			};

		},

		checkMinTravelTime: function (data) {
			if (!this.settings.minTravelTime) {
				return true;
			};

			if (parseFloat(data.durationHours) < parseFloat(this.settings.minTravelTime)) {
				this.showWarnings();
				this.showMinTravelTimeMsg();
				return false;
			} else {
				//clear message
				this.hideWarnings();
				this.hideMinTravelTimeMsg();
				return true;
			};

		},

		checkMaxTravelTime: function (data) {
			this.log('checkMaxTravelTime:');
			if (!this.settings.maxTravelTime) {
				this.log('no limit');
				return true;
			};
			this.log(data.durationHours);
			this.log(this.settings.maxTravelTime);
			if (parseFloat(data.durationHours) > parseFloat(this.settings.maxTravelTime)) {
				this.showWarnings();
				this.showMaxTravelTimeMsg();
				return false;
			} else {
				//clear 
				this.hideWarnings();
				this.hideMaxTravelTimeMsg();
				return true;
			};

		},

		displayMessage: function (msg) {
			$('.map-ctr legend').html(msg);
		},

		displayFeedback: function (msg) {
			$('.tq-feedback').html(msg);
			$('.tq-feedback').show();
		},

		clearFeedback: function () {
			$('.tq-feedback').html('');
			$('.tq-feedback').hide();
		},

		displayJourneyDetails: function (data) {

			this.updateElContent(this.settings.time, data.duration);
			this.updateElContent(this.settings.hours, data.durationText);
			this.updateElContent(this.settings.distance, data.distance);
		},


		displayRoute: function (data) {
			this.log('displayRoute');
			if (!this.settings.showRoute) {
				this.log('not showing');
				return false;
			};
			var noLegsInRoute = data.routes[0].legs.length;
			if(noLegsInRoute===0){
				return false;
			};

			var rendererOptions = this.setRendererOptions();
			//this.log(rendererOptions);
			//clear previous directions if any
			this.clearDirections();

			this.log('directions data');
			this.log(data);

			this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
			this.directionsDisplay.setMap(this.map);
			this.directionsDisplay.setDirections(data);

		},

		filterLegs: function(data){
			var filteredData = $.extend({},data);
			var filteredLegs = $.extend([],filteredData.routes[this.routeIndex].legs);
			if(this.settings.hideLegs.indexOf('dispatch')>-1){
				// dont render first leg of route
				var firstLeg = filteredLegs.shift();
			}

			if(this.settings.hideLegs.indexOf('return_to_base')>-1){
				// dont render last leg of route
				var lastLeg = filteredLegs.pop();			
			};
			filteredData.routes[this.routeIndex].legs = filteredLegs;
			return filteredData;
			
		},

		setRendererOptions: function(){
			var strokeColor = '#0064d3';

			// Create a renderer for directions and bind it to the map.
			var rendererOptions = {
				map: this.map,
				suppressMarkers: !this.isOptimizingRoute(),
				routeIndex: this.routeIndex,
				polylineOptions: {
						strokeColor: strokeColor
				}
			};

			return rendererOptions;
		},

		clearDirections: function(){
			if (!this.isReturnJourney() && this.isOptimizingRoute()) {
				this.hideAllMarkers();
			};
			if (this.directionsDisplay) {
				this.directionsDisplay.setMap(null);
				this.directionsDisplay = null;
			};			
		},

		getAddressPickerInputsFromPage: function () {
			var pickers = $('input.addresspicker');
			return pickers;
		},

		getAddressPosition: function (addressRec) {

			//get gmaps position from db address rec
			if (!addressRec) {
				this.log('no addressRec');
				return false;
			};

			if (!addressRec.lat) {
				this.log('no addressRec lat');
				return false;
			};

			if (!addressRec.lng) {
				this.log('no addressRec lng');
				return false;
			};
			var pos = new google.maps.LatLng(addressRec.lat, addressRec.lng);
			if (!pos) {
				return false;
			};
			return pos;
		},

		getDateTime: function () {
			//get the date and time parts from the passed datetime
			if (!this.settings.date) {
				this.log('date and time unavailable');
				return false;
			};

			this.date = new Date(this.settings.date);
			this.weekDay = this.date.getDay();
			this.hour = this.date.getHours();
		},

		getDeliveryDate: function () {
			if (!this.datepickerSelector) {
				return false;
			};

			var datepicker = $(this.datepickerSelector);
			if (!datepicker.length == 1) {
				return false;
			};

			var deliveryDate = $(datepicker).get('value');
			if (!deliveryDate) {
				return false;
			};


			return deliveryDate;
		},

		getDeliveryTime: function () {
			if (!this.timepickerSelector) {
				return false;
			};
			var timepicker = $(this.timepickerSelector);
			if (!timepicker.length == 1) {
				return false;
			};
			var deliveryTime = $(timepicker).val();
			if (!deliveryTime) {
				return false;
			};

			return deliveryTime;
		},

		getFormOptions: function () {
			this.serviceType = this.getSelectedServiceType();
			this.log('serviceType: ' + this.serviceType);
			//this.populateHiddenServiceField();
			this.vehicleType = this.getVehicleType();
			this.log('vehicleType: ' + this.vehicleType);
			//	this.populateHiddenVehicleField();
			this.deliveryDate = this.getDeliveryDate();
			this.log('deliveryDate: ' + this.deliveryDate);
			this.deliveryTime = this.getDeliveryTime();
			//this.log('getDeliveryTime: ' + this.deliveryTime);
		},

		getFormRefs: function () {
			//set up references to the form elements to populate if they exist
			this.quoteResult = $('#' + this.settings.quoteResult);
			this.surcharge = $('#' + this.settings.surcharge);
			//pick up info
			this.pickUpAdminAreaLevel2 = $('#' + this.settings.pickUpAdminAreaLevel2);
			this.pickUpAdminAreaLevel1 = $('#' + this.settings.pickUpAdminAreaLevel1);
			this.pickUpCountry = $('#' + this.settings.pickUpCountry);
			this.pickUpPostalCode = $('#' + this.settings.pickUpPostalCode);

			this.pickUpLat = $('#' + this.settings.pickUpLat);
			this.pickUpLng = $('#' + this.settings.pickUpLng);

			//drop off info
			this.dropOffAdminAreaLevel2 = $('#' + this.settings.dropOffAdminAreaLevel2);
			this.dropOffAdminAreaLevel1 = $('#' + this.settings.dropOffAdminAreaLevel1);
			this.dropOffCountry = $('#' + this.settings.dropOffCountry);
			this.dropOffPostalCode = $('#' + this.settings.dropOffPostalCode);

			this.dropOffLat = $('#' + this.settings.dropOfLat);
			this.dropOffLng = $('#' + this.settings.dropOfLng);

			//set up a reference to timepicker field if we are usinge delivery time to calculate charges
			if (this.settings.timepickerSelector) {
				this.timepickerSelector = '#' + this.settings.timepickerSelector;
			} else {
				this.timepickerSelector = false;
			};

			//set up a reference to a datepicker field if we are usinge delivery date to calculate charges
			if (this.settings.datepickerSelector) {
				this.datepickerSelector = this.settings.datepickerSelector;
			} else {
				this.datepickerSelector = false;
			};

			this.selectServiceEl = $('#service_id');
			this.selectVehicleEl = $('#vehicle_id');
		},

		getHiddenAddressParts: function (addressIndex) {
			var addressParts = [];

			//populate each component
			$.each(this.settings.addressCmpNames, function (idx, cmp_name) {
				var elName = '#address_' + addressIndex + '_' + cmp_name;
				var part = $(elName).val();
				if (part) {
					addressParts.push(part);
				};
			});
			if (addressParts.length == 0) {
				return false;
			};

			return addressParts;
		},

		getHolidays: function () {
			//create date object for holidays passed
			if (!this.settings.holidays) {
				//no holidays set
				this.holidays = false;
				return false;
			};

		},

		getLeadTime: function () {
			if (!this.settings.minNotice) {
				return false;
			};
			if (this.settings.minNotice.indexOf(':') == -1) {
				return false;
			};
			var leadHours = parseInt(this.settings.minNotice.split(':')[0]);
			var leadMins = parseInt(this.settings.minNotice.split(':')[1]);
			var leadHoursMs = leadHours * 3600000;
			var leadMinsMs = leadMins * 900000;
			var leadTime = leadHoursMs + leadMinsMs;

			return leadTime;

		},

		getMapData: function () {
			if (!this.mapData) {
				return false;
			};
			return this.mapData
		},

		getMarker: function (addressIndex) {
			// return marker for google places input for addressIndex

		},

		getInfoWindow: function (addressIndex) {
			// return infoWindow for google places input for addressIndex

		},

		

		getElTagNameIfExists: function (selector) {

			if (!selector) {
				return false;
			};

			var elTagName = $(selector).prop('tagName');

			if (!elTagName) {
				return false;
			};

			elTagName = elTagName.toLowerCase();

			return elTagName;
		},

		getSelectedServiceType: function () {
			// get id of service to look up rates

			// default to service 1 if there is no service element
			var serviceType = this.settings.defaultServiceId;

			var serviceElementTagName = this.getElTagNameIfExists('#service_id');

			switch (serviceElementTagName) {
				case 'input':
					serviceType = $('input#service_id').val();
					serviceType = 's_' + serviceType;
					break;
				case 'select':
					serviceType = $('#service_id').val();
					serviceType = 's_' + serviceType;
					break;
			};
			return serviceType;
		},

		getVehicleType: function () {
			// get id of vehicle to look up rates

			// default to 1 in case there is no vehicle selct
			var vehicleType = this.settings.defaultVehicleId;

			var vehicleElementTagName = this.getElTagNameIfExists('#vehicle_id');

			switch (vehicleElementTagName) {
				case 'input':
					var vehicleType = $('input[name="vehicle_id"]:checked').val();
					break;
				case 'select':
					var vehicleType = $('#vehicle_id').val();
					break;
			};

			return vehicleType;
		},

		getVehicleNameFromId: function (vehicleId) {
			var vehicles = ['Small Van',
				'Transit Van',
				'Large Van'];
			return vehicles[vehicleId];
		},

		geoLocateUser: function (cb) {
			var that = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					if (cb) {
						cb(position);
					};
				});
			};
		},

		populateCostElements: function (costs) {
			var that = this;

			$.each(costs, function (idx, cost) {
				var el = idx + 'Cost';
				//that.log('populateCostElements: '+el);
				var cost = that.round(cost);
				that.log('populating cost: ' + idx + ', value: ' + cost);
				that.updateElContent(el, cost);
				if (cost != 0) {
					$(el).show();
				}
			});
		},

		populateHourlyRate: function (hourlyRate) {
			var that = this;
			$('input[type="hidden"][name="rate_hour"]').val(hourlyRate);
		},

		populateHiddenServiceField: function () {
			var serviceTypeId = this.serviceType.replace('s_', '');
			$('input[type="hidden"][name"quote_service_id"]');
		},

		populateHiddenVehicleField: function () {

		},

		updateFormHiddenAddressFields: function (addressIndex, components) {
			var that = this;
			//update form with location data

			if (!components) {
				return false;
			};

			//populate each component
			$.each(this.settings.addressCmpNames, function (idx, cmp_name) {

				var elValue = that.getAddressPart(components, cmp_name, 'long_name');
				var selector = 'input[name="address_' + addressIndex + '_' + cmp_name + '"]';
				if (cmp_name === 'postal_code') {
					//if there is a postcode check that it is a full UK postcode, otherwise do not populate it
					if (that.validPostcode(elValue)) {
						that.updateElContent($(selector), elValue);
					};
				} else {
					that.updateElContent($(selector), elValue);
				};

			});
		},

		updateFormHiddenLatLng: function (addressIndex, pos) {
			var latElId = 'address_' + String(addressIndex) + '_lat';
			var lngElId = 'address_' + String(addressIndex) + '_lng';
			this.updateElContent(latElId, pos.lat());
			this.updateElContent(lngElId, pos.lng());
		},

		updateFormHiddenPlaceId: function (addressIndex, placeId) {
			var placeElId = 'address_' + String(addressIndex) + '_place_id';
			this.updateElContent(placeElId, placeId);
		},


		validPostcode: function (postCode) {
			postCode = postCode.replace(/\s/g, '');
			var re = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

			return re.test(postCode);
		},
		updateElContent: function (el, value) {
			if (!el) {
				return false;
			};
			//that.log(el);
			if (typeof (el) == 'object') {
				var domEl = $(el).get(0);
			} else {
				var id = '#' + el;
				var domEl = $(id).get(0);
			};
			//populate html elements by id
			if (domEl) {
				var tagName = domEl.tagName;
				//that.log('populate domEl: ' + tagName);
				switch (tagName) {
					case 'SPAN':
					case 'DIV':
					case 'P':
						//that.log(domEl);
						//that.log(value);
						$(domEl).html(value);
						break;
					default:
						$(domEl).val(value);
				};
			};

			//single object so return true;
			if (typeof (el) == 'object') {
				return true;
			};


			var inputId = 'input[name="' + el + '"]';
			var textId = 'textarea[name="' + el + '"]';
			var className = '.' + el;

			//populate form input elements
			$(inputId).val(value);

			//populate form input elements by class
			var elClass = '.' + el;
			$(elClass).val(value);

			//that.log('textId: ' + textId);
			//populate form textareas
			$(textId).text(value);

			//populate any html element or form element by class
			$(className).html(value);
			$(className).text(value);
			$(className).val(value);
			return true;
		},

		updateBounds: function () {
			this.log('updateBounds');
			var bounds = new google.maps.LatLngBounds();
			$.each(this.addressPickers, function (idx, addressPicker) {
				var pos = addressPicker.getPos();
				if (pos) {
					bounds.extend(pos);
				};

			});

			this.map.fitBounds(bounds);
		},

		getAddressPart: function (result, field, field_type) {
			//return a specific field from the address

			var value = '';
			$.each(result, function (idx, cmp) {
				$.each(cmp.types, function (idx2, type) {
					if (type == field) {
						value = cmp[field_type];
					};
				});
			});

			return value;
		},

		clickMap: function (e) {
			//called after map is clicked					
			if (this.marker) {
				if (this.marker.getVisible()) {
					this.marker.setPosition(e.latLng);
					this.marker.setVisible(true);
					this.updatePosition(this.marker.addressType);
				};
			};

		},

		dragEnd: function (marker) {
			//called after marker is dragged
			this.updatePosition(marker.addressType);
		},

		setMapData: function (data) {
			// store a copy of the o
			if (!data) {
				this.mapData = '';
			} else {
				this.mapData = data;
			}
		},

		setUnitDistance: function (data) {
			//set distance property according to option
			switch (this.settings.units) {
				case 'imperial':
					var distance = this.round(data.miles);
					break;
				case 'metric':
					var distance = this.round(data.distanceKm);
					break;
			};
			data.distance = distance;
		},

		updatePosition: function (addressType) {
			var that = this;


			//Update  the form fields with new lat lng and fetch geocode results for form
			var position = this.marker.getPosition();

			//Update the lat and lng form inputs
			if (this.lat) {
				$(this.lat).val(position.lat());
			};
			if (this.lng) {
				$(this.lng).val(position.lng());
			};

			switch (addressType) {
				case 'Pick Up':
					this.pickUpPos = position;
					break;
				case 'Drop Off':
					this.dropOffPos = position;
					break;
			};

			this.reverseGeocode(position, function (results) {
				if (results[0]) {
					that.updateFormHiddenAddressFields(results[0]);

				};
			});
		},

		initPageEvents: function () {
			var that = this;

			$('#map').on('click', '.picker-btn button', function (e) {
				e.preventDefault();
				e.stopPropagation();
				that.clickPickAddressBtn(this);
			});

			$('input[type=radio][name="optimize_route"]').on('change', function (e) {
				that.changeOptimizeRoute();
			});

			this.addListenerAddAddressPickerLink();
			this.addListenerRemoveAddressPickerLink();

		},

		changeDeliverReturn: function (el, recalculate) {
			this.clearJourneyData();
			this.clearQuote();		
			if(this.routeIsValid())	{
				this.processRoute();
			};
			

						/*if (recalculate) {
				this.clearJourneyData();
				this.clearQuote();

				if (this.isReturnJourney()) {
					if (this.isRoutePossible()) {
						this.setWaypoints();
						this.calcDeliverReturnRoute();
					};
				} else {
					this.waypoints = false;
					//set dest to the drop off marker position again
					this.dropOffPos = this.addressPickers[this.addressPickers.length - 1].getPos();
					if (this.isRoutePossible()) {
						this.setWaypoints();
						this.calcOneWayRoute();
					};
				};
			};*/
		},

		changeOptimizeRoute: function (el) {
			this.refreshGoogleDirections();
		},

		addListenerAddAddressPickerLink: function () {
			var that = this;
			$('.tq-form').on('click', 'a.add-waypoint', function (e) {
				e.preventDefault();
				e.stopPropagation();
				that.hideLinkIfStartAddressFixed(this);
				that.addAddressPicker(this);
			})
		},

		hideLinkIfStartAddressFixed: function (link) {
			if (this.isFixedStart()) {
				if (this.addressPickers.length === 1) {
					$(link).hide();
				};
			}
		},

		addListenerRemoveAddressPickerLink: function () {
			var that = this;
			$('.tq-form').on('click', 'a.remove-address', function (e) {
				e.preventDefault();
				e.stopPropagation();
				that.removeAddressPicker(this);
				that.removeMarker(this);
				that.updateJourneyOrder();
				that.refreshGoogleDirections();
			});
		},

		refreshGoogleDirections: function () {
			//clear directions and quote
			this.clearQuote();
			this.clearJourneyData();			
			if (this.routeIsValid()) {
				this.processRoute();
			};
		},

		clickPickAddressBtn: function (btn) {
			var that = this;

			this.clearDirections();

			var addressPicker = this.getBtnAddressPicker(btn);

			addressPicker.hideInfoWindow();
			addressPicker.setPosFromMarker();
			addressPicker.setMarkerDraggable(false);
			addressPicker.getAddressForPosition(function (addressResult) {
				if (addressResult.formatted_address) {
					addressPicker.setAddress(addressResult.formatted_address);
					addressPicker.setPlace(addressResult);
					addressPicker.setRawAddress(addressResult);
					addressPicker.setAddresInputFromAddress();
					var locNo = addressPicker.getIndex();
					that.updateFormHiddenAddressFields(locNo, addressResult.address_components);
					that.updateFormHiddenLatLng(locNo, addressPicker.getPos());
					that.updateFormHiddenPlaceId(locNo, addressPicker.getPlaceId());
					addressPicker.setMarkerInfoWindow();
					//check if route is now available
					if (that.routeIsValid()) {
						that.processRoute();
					};
				};
			});


		},

		clearDirections: function () {
			//clear previous directions if any
			if (this.directionsDisplay) {
				this.directionsDisplay.setMap(null);
			};
		},

		getBtnAddressPicker: function (btn) {
			var locNo = this.getLocNoForBtn(btn);
			if (locNo) {
				return this.getAddressPickerByIndex(locNo);
			};
			return false;
		},

		getLocNoForBtn: function (btn) {
			var btnName = $(btn).attr('name');
			var nameParts = btnName.split('-');
			if (nameParts[1]) {
				return nameParts[1];
			};
			return false;
		},

		clearAddresses: function () {
			this.dropOffPos = '';
			this.pickUpPos = '';
			$(this.settings.pickUpInput).val('');
			$(this.settings.dropOffInput).val('');
		},

		clearQuote: function () {
			//clear prev quote and directions
			$('input[name="total"]').val('');
			//clear prev directions
			if (this.directionsDisplay) {
				this.directionsDisplay.setMap(null);
			};

			this.waypoints = false;
		},

		clearJourneyData:function(){
			$('input[name="distance"]').val('');
			$('input[name="return_distance"]').val('');
			$('input[name="return_time"]').val('');
		},

		initMap: function () {
			if (!this.mapId) {
				this.log('No element id has been set to use for the map.');
				return false;
			};

			this.mapElement = $('#' + this.mapId);
			if (this.mapElement.length == 0) {
				this.log('No element exists for mapId: ' + this.mapId);
				return false;
			}

			var options = this.getMapOptions();
			this.gmap = $(this.mapElement[0]).gmap(options);

			//store jquery version
			this.map = $(this.gmap).gmap('get', 'map');

		},

		getMap: function(){
			return this.map;
		},

		getLocNoFromClass: function (el) {
			var clsParts = el.className.split('-');
			var locNo = clsParts.pop();
			return locNo;
		},

		getMapOptions: function () {

			if (!this.mapOptions) {
				this.mapOptions = $.extend({}, this.settings.map);

				//create gmap point for start
				this.mapOptions.center = new google.maps.LatLng(this.mapOptions.startLat, this.mapOptions.startLng);

				//remove non-google options 
				delete this.mapOptions.startLat;
				delete this.mapOptions.startLng;

				this.log('getMapOptions: ');
				this.log(this.mapOptions);
			};

			return this.mapOptions;
		},

		getNewAddressPickerIndex: function () {
			// the new id number will be the number of pickers so far + 1 so equal to the 0 based length of the addressPickers array
			var noPickers = this.addressPickers.length;
			if (this.isFixedStart()) {
				var nextAddressPickerId = noPickers + 1;
			} else {
				var nextAddressPickerId = noPickers;
			}
			return nextAddressPickerId;
		},

		insertAddressPickerHtml: function (addressPickerInputId, insertDestinationAnchorElement) {
			// insert html template for picker after addWaypointLink
			var templateData = {
				idx: String(addressPickerInputId),
				insertDestLinkText: this.settings.insertDestLinkText,
				removeDestLinkText: this.settings.removeDestLinkText,
				cantFindAddressText: this.settings.cantFindAddressText,
				askForPostCode: this.settings.askForPostCode,
				askForUnitNo: this.settings.askForUnitNo,
				destinationAddressLabel: this.settings.destinationAddressLabel,
				unitNoLabel: this.settings.unitNoLabel
			};

			//insert new addrespicker template after the closest address-wrap - the one surrounding the Insert Destination anchor element
			$(insertDestinationAnchorElement).closest('.address-wrap').after(this.settings.addressPickerTemplate(templateData));
			if (this.addressPickers.length >= this.settings.maxAddressPickers) {
				$('#address_' + addressPickerInputId).closest('.address-wrap').append(this.settings.addressTemplateLast(templateData));
				this.hideAllInsertAddressPickerLinks();
			} else {
				//have not reached maximum number of address pickers
				templateData.showInsertAddressPickerLink = true;
				$('#address_' + addressPickerInputId).closest('.address-wrap').append(this.settings.addressTemplate(templateData));
			};
			if(this.settings.afterInsertAddress){
				this.settings.afterInsertAddress(templateData);
			};

		},

		hideAllInsertAddressPickerLinks: function () {
			$('.add-waypoint').hide();
		},

		showAllInsertAddressPickerLinks: function () {
			$('.add-waypoint').show();
		},


		clickMarker: function (marker, markerSetName) {

			var that = this;

			//set map to position of marker
			var latLng = marker.getPosition();
			this.map.setCenter(latLng);

		},

		log: function (data) {
			if (this.settings.debug) {
				console.log(data);
			}
		},
		pickLocation: function (locNo, cb) {
			//configure for picking location with a click
			//set marker as current

			//clear previous directions if any
			if (this.directionsDisplay) {
				this.directionsDisplay.setMap(null);
			};
			var addressPicker = this.getAddressPickerByIndex(locNo);
			var marker = addressPicker.getMarker();
			var message = 'Drag the marker then click below to choose a location';
			message += '<div class="text-center picker-btn"><button class="confirm-pos-btn sml" name="pick-' + locNo + '">It&apos;s right here!</button></div>';

			$('#address_' + locNo).val('');

			//display marker if not displaying
			marker.setVisible(true);
			marker.setDraggable(true);
			//set map to position of marker
			var latLng = marker.getPosition();
			this.map.setCenter(latLng);

			//show info window
			addressPicker.setMarkerInfoWindow(message);

			if (cb) {
				cb(marker);
			};
		},

		removeAddressPicker: function (link) {
			//remove address html input

			$(link).closest('.address-wrap').remove();
			this.showAllInsertAddressPickerLinks();
		},

		removeMarker: function (link) {
			//remove marker for addresspicker
			var locNo = this.getLocNoFromClass(link);
			var addressPicker = this.getAddressPickerByIndex(locNo);
			if (addressPicker) {
				addressPicker.hideMarker();
			} else {
				// this.log('could not find location to remove marker');
			};
		},

		reverseGeocode: function (latlng, callback) {
			var that = this;

			this.geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						callback(results);
					}
				}
			});
		},

		round: function (n, places) {
			var places = (places) ? places : 2;
			return parseFloat(Math.round(n * 100) / 100).toFixed(places);
		},

		setFormDefaults: function () {
			//set default form values 
			$('input[name="vehicle"]:first').prop('checked', true);

		},

		setCenterLatLng: function (lat, lng) {
			//set center from passet lat / lng coordinates
			if (isNaN(lat)) {
				return false;
			};
			if (isNaN(lng)) {
				return false;
			};
			this.map.setCenter({ lat: lat, lng: lng });
		},

		setUnits: function () {
			//make sure units are compatible with Google Maps API
			var distanceUnits = this.settings.units.toLowerCase();
			switch (distanceUnits) {
				case 'kilometers':
				case 'kilometer':
				case 'km':
				case 'metric':
					this.settings.units = 'metric';
					break
				default:
					this.settings.units = 'imperial';
					break;
			}

		},

		setWaypoints: function () {
			var that = this;
			this.log('setWaypoints');


			if (that.isFixedStart()) {
				// when including the return journey index 1 (destination) is also a waypoint
				var waypointsStartAfterIndex = 0;
			} else {
				var waypointsStartAfterIndex = 1;

			};

			this.waypoints = [];
			this.userWaypoints = [];
			$.each(this.addressPickers, function (idx, addressPicker) {
				var index = addressPicker.getIndex();
				if (index > waypointsStartAfterIndex) {
					var wayPoint = addressPicker.getPos();
					if (wayPoint) {
						that.waypoints.push({
							location: wayPoint,
							stopover: true
						});

						that.userWaypoints.push({
							place: addressPicker.getPlace(),
							location: wayPoint,
							stopover: true
						});
					}
				} else {
					// this.log('do not add waypiont for picker: ' + index);
				}
			});
		},

		getAddressPickerByIndex: function (addressPickerInputIndex) {
			// get AddressPicker object by its index peroerty
			var result = $.grep(this.addressPickers, function (e) {
				return e.getIndex() == addressPickerInputIndex;
			});
			if (result.length > 0) {
				var addressPicker = result[0];
				return addressPicker;
			};
			return false
		},

		updateJourneyOrder: function () {
			var that = this;
			var pickerInputs = this.getAddressPickerInputsFromPage();
			var sortedPickers = [];
			var idxIncrement = 0;
			/*if (that.settings.pickStartAddress === 'false') {
				var idxIncrement = 1;
			};*/
			// loop through pickers
			$.each(pickerInputs, function (idx, picker) {
				// get id number of html input group for the address

				var addressPickerInputId = picker.id;
				var addressPickerInputIndex = addressPickerInputId.split('_')[1];
				var addressPicker = that.getAddressPickerByIndex(addressPickerInputIndex);
				if (addressPicker) {
					var addressIndex = idx + idxIncrement;
					addressPicker.populateHiddenJourneyOrderInput(addressIndex);
					sortedPickers.push(addressPicker);
				} else {
					// this.log('could not find addressPicker for input: '+ addressPickerInputIndex);
				};

			});

			this.addressPickers = sortedPickers;

		},

		updateQuote: function () {
			//options have changed, update quote if directions are in place
			var that = this;
			this.log('updateQuote');
			this.hideMinDistanceMsg();
			this.hideMinCostMessage();
			this.hideWarnings();

			//get directions data if any
			var data = this.getMapData();
			if (!data) {
				this.log('no directions');
				return false;
			};

			//format distance to metric/imperial  
			this.setUnitDistance(data);
			this.log('setUnitDistance ok: ' + data.distance);

			if (!this.checkJourneyRestrictions(data)) {
				$('.buttons').hide();
				return false;
			};

			//get delivery options from booking form
			this.getFormOptions();
			this.log('getFormOptions ok');
			//update with cost data

			//this.setMapData(data);
			this.displayJourneyDetails(data);
		},

		checkJourneyRestrictions: function (data) {
			//check the journey is not too short
			if (!this.checkMinDistance(data)) {
				this.log('checkMinDistance failed');
				return false;
			};
			//check the journey is not too long
			if (!this.checkMaxDistance(data)) {
				this.log('checkMaxDistance failed');
				return false;
			};

			//check the travel time is not too short
			if (!this.checkMinTravelTime(data)) {
				this.log('checkMinTravelTime failed');
				return false;
			};

			//check the travel time is not too long
			if (!this.checkMaxTravelTime(data)) {
				this.log('checkMaxTravelTime failed');
				return false;
			};

			this.log('checkJourneyRestrictions ok');
			return true;
		},

		runAutoTest: function () {
			this.initTest();
			this.testCalculations();
			this.renderTestResults();
			$('#quote-form').show();
			$('#test-message').hide();
		},

		showWarnings: function () {
			$('.tq-warning').show();
			$('.buttons').hide();
			$('.quote-success').hide();
			$('.quote-fail').show();
			$('.quote-fields').show();
			$('.quote-fields').removeClass('hidden');
		},

		hideWarnings: function () {
			$('.tq-warning').hide();
		},

		showMinDistanceMsg: function () {
			$('.min-distance-msg').show();
		},

		showMinCostMsg: function () {
			$('.min-cost-msg').show();
		},

		showMaxDistanceMsg: function () {
			$('.max-distance-msg').show();
		},

		hideMaxDistanceMsg: function () {
			$('.max-distance-msg').hide();
		},

		showMinTravelTimeMsg: function () {
			$('.min-travel-time-msg').show();

		},

		hideMinTravelTimeMsg: function () {
			$('.min-travel-time-msg').hide();
		},

		showMaxTravelTimeMsg: function () {
			$('.max-travel-time-msg').show();
		},

		hideMaxTravelTimeMsg: function () {
			$('.max-travel-time-msg').hide();
		},


		initTest: function () {
			this.testJourneys = [];

			for (var journeyLength = 0; journeyLength < this.settings.maxTestJourneyLength; journeyLength = journeyLength + this.settings.testJourneyIncrement) {
				this.createTestParams(journeyLength);
			};
		},

		createTestParams: function (journeyLength) {
			var that = this;
			//loop through services and create a set of tests for each service
			$.each(this.serviceList, function (idx, serviceId) {
				that.createVehicleTests({
					serviceId: serviceId,
					journeyLength: journeyLength
				});
			});

		},

		createVehicleTests: function (params) {
			var that = this;
			//loop through services and create a set of tests for each
			$.each(this.vehicleList, function (idx, vehicleId) {
				// start with passed serviceId and journeyLength 
				var vehicleTest = $.extend({}, params, { vehicleId: vehicleId });
				that.testJourneys.push(vehicleTest);
			});
		},

		testCalculations: function () {
			var that = this;
			$.each(this.testJourneys, function (idx, journeyParams) {
				that.testJourneys[idx].results = that.testCalculation(journeyParams);
			});
		},

		testCalculation: function (journeyParams) {
			var that = this;

			//get directions data if any
			var data = {
				distance: journeyParams.journeyLength,
				distanceKm: journeyParams.journeyLength,
				miles: journeyParams.journeyLength,
				durationHours: 0 // not testing yet
			};
			this.log('getMapData ok');
			//check we are not out of range
			if (!this.checkMaxDistance(data)) {
				return false;
			};
			this.log('checkMaxDistance ok');
			//format distance to metric/imperial  
			this.setUnitDistance(data);
			this.log('setUnitDistance ok');
			//get delivery options from booking form
			this.emulateFormOptions(journeyParams);
			this.log('getFormOptions ok');
			//update with cost data
			results = this.calcQuote(data);
			results.distance = data.distance;
			return results;

		},

		emulateFormOptions: function (journeyParams) {
			this.serviceType = 's_' + String(journeyParams.serviceId);
			this.vehicleType = journeyParams.vehicleId;
			this.deliveryDate = this.getDeliveryDate();
			this.deliveryTime = this.getDeliveryTime();
		},
		renderTestResults: function () {
			this.createTestTableEl();
			this.appendResultTableRows();
			this.renderTableHTML();
		},

		createTestTableEl: function () {
			this.resultsTableEl = $("<table>", { id: "test_results", "class": "test-results" });
			this.resultsTableEl.append('<th>Distance</th><th>Small Van</th><th>Transit Van</th><th>Large Van</th>');
			$('#quote-form').after(this.resultsTableEl);
		},

		appendResultTableRows: function () {
			var that = this;
			var rows = [];

			$.each(this.testJourneys, function (idx, journey) {

				var rowId = 'd_' + String(parseInt(journey.results.distance));

				// create row for this distance
				if (!rows[rowId]) {
					rows[rowId] = '<td>' + journey.results.distance + '</td>';
				};

				// append result for this combination
				//rows[rowId] += resultRowHtml = '<td>Service:' +journey.serviceId+', vehicle: '+journey.vehicleId+'</td>';
				rows[rowId] += '<td>' + that.round(journey.results.total) + '</td>';

			});
			var allRows = '';

			for (var journeyLength = 0; journeyLength < this.settings.maxTestJourneyLength; journeyLength = journeyLength + this.settings.testJourneyIncrement) {
				var rowId = 'd_' + String(journeyLength);
				allRows += '<tr>';
				allRows += rows[rowId];
				allRows += '</tr>';
			};
			$(this.resultsTableEl).append(allRows);
		},

		renderTableHTML: function () {
			// this.log(this.element);

		}

	}; // End of plugin definition

	$.fn[pluginName] = function (options) {
		var plugin;
		this.each(function () {
			plugin = $.data(this, 'plugin_' + pluginName);
			if (!plugin) {
				plugin = new Plugin(this, options);
				$.data(this, 'plugin_' + pluginName, plugin);
			}
		});
		return plugin;
	};
})(jQuery, window, document);
