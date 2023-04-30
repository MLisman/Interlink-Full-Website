/*	Google Maps Quote Calculatior Order Form
*	jQuery Plugin from Creative Transmissions 
*	http://www.creativetransmissions.com/google-maps-quote-calculator-plugin
*	Author: Andrew van Duivenbode
* 	Liscence: MIT Liscence - See liscence.txt
*/


;(function ( $, window, document, undefined ) {
		// Create the defaults 
		var map;
		var pluginName = "TransitQuotePro",
		
		defaults = {
			ajaxUrl: '',
			customer: false,
			debug: false,
			quoteResult: 'quote',
			timepickerSelector: 'input[name="delivery_time"]',
			datepickerSelector: 'input[name="date"]'
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		Plugin.prototype = {

			/* initialization code */
			init: function () {	
				if(!this.initTheme()){
					return false;
				};

				if(!this.initData()){
					return false;
				};
				if(!this.initUI()){
					return false
				};

				if(!this.initEvents()){
					return false
				};
			},

			initTheme: function(){
				if(!$.fn.ThemeFunctions){
					return true;
				};

				this.themeFuncs = new $.fn.ThemeFunctions({public: this});
				
				return true;
			},
			

			initData: function(){
				this.log('initData');
				this.initDataMapSettings();
				this.initDataJourneyRestrictions();
				this.payPalInitialized = false;
				return true;
			},


			initDataMapSettings: function(){
				//Initialize map settings
				this.geolocate = (this.settings.data.geolocate=='true')?true:false;

				this.mapSettings = {
						// Google Map Options
						mapTypeId : google.maps.MapTypeId.ROADMAP, 
						scrollwheel : false,
						startLat: 38.8763,
						startLng: 12.1852,
						zoom: 2
				};

				if((this.settings.data.startLat!='')&&(this.settings.data.startLng!='')){
					this.mapSettings.startLat = this.settings.data.startLat;
					this.mapSettings.startLng = this.settings.data.startLng;
					this.mapSettings.zoom = 10;
				} else {
					//geolocate current user position if no start lat or lng is returned
					this.geolocate = true;
				};					

			},

			initDataJourneyRestrictions: function(){

				if(this.settings.data.max_distance==0){
					this.settings.data.max_distance = false;
				};

				if(this.settings.data.max_travel_time==0){
					this.settings.data.max_travel_time = false;
				};
				
			},

			initUI: function () {					
				this.initCalculator();
				if(this.calculator){
					this.calculator.filterAvailableVehicles();
					$('#vehicle_id option').each(function () {
					    if ($(this).css('display') != 'none') {
					        $(this).prop("selected", true);
					        return false;
					    }
					});
				};
				//this.initDatePicker();				
				this.initParsleyValidation();
				this.initPolygons();
				$('.notice-field').hide();
				return true;				
			},

			initCalculator: function(){
				var that = this;

				var calcConfig = this.getDefaultCalcConfig();
				var themeCalcConfig = this.getThemeCalcConfig();
				if(themeCalcConfig){
					calcConfig = $.extend(calcConfig, themeCalcConfig);
				};
				//Initialize Google Maps Quote Calculator jquery plugin
				this.calculator = $('#map').mapQuoteCalculator(calcConfig);
			},

			getDefaultCalcConfig: function(){
				var that = this;
				var maxAddressPickers = this.settings.data.max_address_pickers;
				var hiddenMaxAddressPickers = $('#max_address_pickers').val();
				if(hiddenMaxAddressPickers){
					maxAddressPickers = hiddenMaxAddressPickers;			
				};
				return {
					routeType: this.settings.data.route_type,
					ajaxUrl: TransitQuoteProSettings.ajaxurl,
					debug: this.settings.debug,

					// fare calculation options
					limits: this.limits, // Travel distance boundaries for which rates to use

					// the costs per mile or kilometer depending on which is selected

					//Prices per mile when over the highest distance limit
					costPerUnit: this.excessDistance,
					
					showRoute: true,
					transportationMode: this.settings.data.transportation_mode,
					askForUnitNo: this.settings.data.ask_for_unit_no,
					askForPostCode: this.settings.data.ask_for_postcode,
					destinationAddressLabel: this.settings.data.destination_address_label,
					units: this.settings.data.distance_unit, // imperial or metric
					geolocate: this.geolocate,
					// Google Map Options
					map :this.mapSettings,
					maxAddressPickers: maxAddressPickers,
					minNotice: this.settings.data.min_notice,
					minNoticeCharge: this.settings.data.min_notice_charge,
					minCost: this.settings.data.min_price,
					minDistance: this.settings.data.min_distance,
					minDistanceMsg: this.settings.data.min_distance_msg,

					pickStartAddress: this.settings.data.pick_start_address,
					returnToBase: this.settings.data.use_return_to_base_rates,
					returnToCollection: this.settings.data.use_return_to_collection_rates,

					startPlaceName: this.settings.data.startPlaceName,
					maxDistance: this.settings.data.max_distance,
					maxDistanceMsg: this.settings.data.max_distance_msg,

					minTravelTime: this.settings.data.min_travel_time,
					minTravelTimeMsg: this.settings.data.min_travel_time_msg,

					maxTravelTime: this.settings.data.max_travel_time,
					maxTravelTimeMsg: this.settings.data.max_travel_time_msg,

					insertDestLinkText: this.settings.data.insert_dest_link_text,
					removeDestLinkText: this.settings.data.remove_dest_link_text,
					cantFindAddressText: this.settings.data.cant_find_address_text,
					
					unitNoLabel: this.settings.data.unit_no_label,


					/*	
						The form elements tell the plugin which html inputs are used for 
						entering the addresses and diplaying the reuslts 

						You can also use them to put the information into form fields so you can save them to your server
					*/

					// Required Form Elements 
					pickUpInput: 'address_0', // The id of the text input for the pick up address
					dropOffInput: 'address_1',  // The id of the text input for the drop off address

					 /* The id of the text input or html element for displaying the quote.
					 	You can also set a comma separated list of ids if you would like to populate more than one element
					 	for example display in a large results box and a hidden form element */

					quoteResult: this.settings.data.quoteResult, // for more than one: 'quote,hiddenquote'
					distance: 'distance', //The id of the text input or html element for displaying the distance					
					hours: 'hours',  //The id of the text input or html element for displaying estimated travel time

					surcharge: 'surcharge',

					// Optional Form Elements - Latitude and Longitude coordinates for addresses
					pickUpLat: 'address_0_lat', 
					pickUpLng: 'address_0_lng',

					dropOfLat: 'address_1_lat',
					dropOfLng: 'address_1_lng',

					restrictToCountry: this.settings.data.restrict_to_country,
					showSurchargeZones: this.settings.data.show_surcharge_zones,

					countryCode: this.settings.data.country_code,
					searchRadius: this.settings.data.search_radius,
					rates: this.settings.data.rates,
					//This will override the template in map-quote-calculator.js and can be used to change the html for dynamically added destinations
					addressPickerTemplate: function(data){
						if(!data.idx){
							return false;
						};
						
						var idx = data.idx;
						var html  = '<div class="address-wrap">';
							html += '	<div class="field bt-flabels__wrapper full-width full">';
                        	html += '		<span class="sub_title tq-primary-color"><i class="icon icon-icn-collection-address"></i>'+TransitQuoteProSettings.destination_address_label+'</span><a href="#" class="remove-address no-address-'+idx+'">'+TransitQuoteProSettings.remove_dest_link_text+'</a>';
                        	html += '		<span class="transit_noadress"><a href="#" class="no-address no-address-'+idx+'">'+TransitQuoteProSettings.cant_find_address_text+'</a></span>';
                        	html += '		<input class="text addresspicker" required type="text" name="address_'+idx+'_address" id="address_'+idx+'" value="" autocomplete="new-password" placeholder="'+TransitQuoteProSettings.destination_address_label+'"/>';
                        	html += '		<span class="bt-flabels__error-desc">Required '+TransitQuoteProSettings.destination_address_label+'</span>';
							html += '	</div>';
							if(TransitQuoteProSettings.ask_for_unit_no === 'true'){
	                    		html += '	<div class="inline-block bt-flabels__wrapper half left">';
	                        	html += '		<input class="inline-block half-field" type="text" id="address_'+idx+'_appartment_no" name="address_'+idx+'_appartment_no" placeholder="'+data.unitNoLabel+'" value="" autocomplete="new-password"/>';
								html += '	</div>';
							};
							if(TransitQuoteProSettings.ask_for_postcode === 'true'){
	                    		html += '	<div class="inline-block bt-flabels__wrapper half right last-address-field">';
	                        	html += '		<input class="inline-block postcode half-field half-field-right" type="text" id="address_'+idx+'_postal_code" name="address_'+idx+'_postal_code" placeholder="'+TransitQuoteProSettings.postal_code_label+'" value="" autocomplete="new-password"/>';
	                    		html += '	</div>';
	                    	};
							if(TransitQuoteProSettings.show_contact_name === 'true'){
	                    		html += '	<div class="inline-block bt-flabels__wrapper half left last-address-field">';
	                        	html += '		<input class="inline-block half-field" id="address_'+idx+'_contact_name" type="text" name="address_'+idx+'_contact_name" placeholder="'+TransitQuoteProSettings.contact_name_label+'" value="" autocomplete="new-password"/>';
	                    		html += '	</div>';
	                    	};
							if(TransitQuoteProSettings.show_contact_number === 'true'){
	                    		html += '	<div class="inline-block bt-flabels__wrapper half right last-address-field">';
	                        	html += '		<input class="inline-block postcode half-field half-field-right" type="text" id="address_'+idx+'_contact_phone" name="address_'+idx+'_contact_phone" placeholder="'+TransitQuoteProSettings.contact_phone_label+'" value="" autocomplete="new-password"/>';
	                    		html += '	</div>';
	                    	};
                    		html += '</div>';

						return html;
					},

					afterInsertAddress: function(templateData){
						that.themeFuncs.afterInsertAddress(templateData);
						return true;
					},

					afterQuote: function(quoteData){
						$('#journey_type').val(quoteData.journeyType);
						that.checkPolygonsForPlace();	
						var isValid = that.validateGetQuote()					
						if(isValid){
							that.updateFormAction('tq_pro4_get_quote');
							that.submitFormGetQuote('get_quote');
						};						

					}

				};
			},

			getThemeCalcConfig: function(){
				if(!this.themeFuncs){
					return false;
				};

				return this.themeFuncs.getCalcConfig();
			},
					
			callbackChangeServiceId: function(serviceId){
				// UI changes on vehicle selection
				$('.service.select-desc').hide();
				var descToShowSelector = '.service.v-desc-'+String(serviceId);
				$(descToShowSelector).show();

				if(this.calculator){
					this.calculator.filterAvailableVehicles();
					$('#vehicle_id option').each(function () {
					    if ($(this).css('display') != 'none') {
					        $(this).prop("selected", true);
					        return false;
					    }
					});
					this.calculator.updateQuote();
				};
				
				if(this.validateGetQuote()){
					this.updateFormAction('tq_pro4_get_quote');
					this.submitFormGetQuote('get_quote');
				};	
				
			},

			callbackChangeVehicleId: function(el){

				var that = this;

				var vehicleId = $(el).val();
				// UI changes on vehicle selection
				$('.vehicle.select-desc').hide();
				var descToShowSelector = '.vehicle.v-desc-'+String(vehicleId);
				$(descToShowSelector).show();
				var vehicleText = $('option:selected', el).text();
				$('.vehicle-selected').html(vehicleText);

				this.loadBlockedTimesForVehicle(vehicleId, function(data){

					TransitQuoteProSettings.booked_times = data;
					var selectedDate = $("input[name='delivery_date']").val();
					that.updateTimepickerForNewDate(selectedDate);

					if(that.validateGetQuote()){
						that.updateFormAction('tq_pro4_get_quote');
						that.submitFormGetQuote('get_quote');
					};	

				});
				
			},

			callbackChangeWeight: function(){
				if(this.validateGetQuote()){
					this.updateFormAction('tq_pro4_get_quote');
					this.submitFormGetQuote('get_quote');
				};					
			},


			loadBlockedTimesForVehicle: function(vehicleId, cb){
				
				var data = 'action=tq_pro4_load_blocked_times&vehicle_id='+vehicleId;

				$.post(this.settings.ajaxUrl, data, function(response) {

					if(response.success==='true'){
						cb(response.data);
					};

					// if response fails that is fine as the schedule plugin might not be installed

					$('.spinner-div').hide();

				}, 'json')
			},

			dateConverter:function(UNIX_timestamp){
			  var a = new Date(UNIX_timestamp);
			  var year = a.getFullYear();
			  var month = a.getMonth()+1;
			  var day = a.getDate();
			  var date = day + '-' + month + '-' + year;
			  return date;
			},

			initDatePicker: function(){
				var that = this;
				
				var interval = TransitQuoteProSettings.time_interval;
				var dateRangeToDisable = this.getInitialDateRangeToDisable();
        		var nextAvailableBookingDate = this.getNextAvailableBookingDate();

				var $inputDate = $( this.settings.datepickerSelector ).pickadate({						
					disable : dateRangeToDisable,
					formatSubmit: 'dd-mm-yyyy',
		            hiddenPrefix: 'delivery_',
  					hiddenSuffix: '',
		            min: nextAvailableBookingDate,
		            onSet: function(context) {
		            	that.onSetDatepickerDate(this,context);
				  	},
				  	onClose: function() {
					    $('.timepicker').blur();
					    $('.datepicker').blur();
					    $('.picker').blur();
					}
		        });				
				
		        var datePickerObj = $inputDate.pickadate('picker');

    			var date = new Date();
    				datePickerObj.set('select', date);
			},

			getNextAvailableBookingDate: function(){
				var todayDate = new Date();
				var endOfToday = this.getBookingEndTime();
				if(todayDate > endOfToday){ //same day after booking end time
        			var nextAvailableBookingDate = this.getTommorowDate();
        		} else {
					var nextAvailableBookingDate = new Date();        			
        		};
        		return nextAvailableBookingDate;
			},

			getBookingStartTime: function(){
				var startOfToday = new Date();			            		
				var booking_start_time_datetime = this.dateTimeConverter(this.settings.data.booking_start_time+'000')['time'];
					startOfToday.setHours(booking_start_time_datetime.getHours());
        			startOfToday.setMinutes(booking_start_time_datetime.getMinutes());
        			startOfToday.setSeconds(0);

        		return startOfToday;
			},			

			getBookingEndTime: function(){
				var endOfToday = new Date();			            		
				var booking_end_time_datetime = this.dateTimeConverter(this.settings.data.booking_end_time+'000')['time'];
            		endOfToday.setHours(booking_end_time_datetime.getHours());
            		endOfToday.setMinutes(booking_end_time_datetime.getMinutes());
        			endOfToday.setSeconds(0);

        		return endOfToday;
			},

			getTommorowDate: function(){
				var tommorowDate = new Date();
        			tommorowDate.setDate(tommorowDate.getDate() + 1);
        		return tommorowDate
			},

			getInitialDateRangeToDisable: function(){
				var dateRangeToDisable = [];
				if(TransitQuoteProSettings.blocked_dates){
					dateRangeToDisable = TransitQuoteProSettings.blocked_dates.map(function(t){
						return new Date(t[0]); 
					});
				};

				return dateRangeToDisable;
			},

			getBookedDateRanges: function(forDate = null){
				var that = this;
				if(!forDate){
					var forDate = new Date.UTC();
				} else {
					forDate = this.getUTCDateOnly(forDate);
				};
				var bookedRanges = [];
				if(TransitQuoteProSettings.booked_times){

					$.each(TransitQuoteProSettings.booked_times, function(idx, t){

						var from  = that.getUTCDateOnly(t['from']);
						var to = that.getUTCDateOnly(t['to']);

						var isFromDate = (forDate.toDateString() === from.toDateString());
						var isToDate = (forDate.toDateString() === to.toDateString());

						if(isFromDate||isToDate){
							var range ={from: new Date(t['from']), to:new Date(t['to'])};
							bookedRanges.push(range);
						};
					});
					
				};
				return bookedRanges;
			},

			getUTCDateOnly: function(myDate){
				if(!myDate){
					var myDate = new Date();
				};

				if(typeof(myDate)==='string'){
					var dateString = myDate.split(' ')[0];
					var parts = dateString.split('-');
					var myDate = new Date(parts[0], parts[1] - 1, parts[2]); 
				};
				var utcDateOnly = new Date(Date.UTC(myDate.getFullYear(),myDate.getMonth(), myDate.getDate()));

				return utcDateOnly;
			},

			dateTimeConverter:function(UNIX_timestamp){
				var a = new Date(parseInt(UNIX_timestamp));
				var year = a.getFullYear();
				var month = ('0' + (a.getMonth()+1)).slice(-2); // to add 0 padding
				var day = a.getDate();
				var hours = a.getUTCHours();
				var minutes = a.getUTCMinutes();
				var dateArray = {};
				var formattedString = a.toTimeString().substr(0,5)
				var newDateString = day + '-' + month + '-' + year;
				dateArray['date'] = day + '-' + month + '-' + year;
				dateArray['fullDate'] = a;
				dateArray['time'] = new Date(2016,01,01,hours,minutes,0,0); //just a dummy date
				return dateArray;
			},

			onSetDatepickerDate: function(datepicker, context){
            	if(context.select){ // if its the selected date that has changed
            		var selectedDate = this.dateConverter(context.select);
            		$("input[name='delivery_date']").val(selectedDate);	            	
            		this.updateTimepickerForNewDate(selectedDate);

					if(this.validateGetQuote()){
						this.updateFormAction('tq_pro4_get_quote');
						this.submitFormGetQuote('get_quote');
					}; 
            	}
			},

			updateTimepickerForNewDate: function(selectedDate){
				var datePartsString = selectedDate.split('-');
				var selectedYear = parseInt(datePartsString[2]);
				var selectedMonth = parseInt(datePartsString[1])-1;
				var selectedDay = parseInt(datePartsString[0]);

				var selectedDate = new Date();
				selectedDate.setYear(selectedYear);
				selectedDate.setMonth(selectedMonth);
				selectedDate.setDate(selectedDay);

				selectedDate.setHours(0);
				selectedDate.setMinutes(0);
				selectedDate.setSeconds(0);
			    selectedDate.setMilliseconds(0);

				// get reference to timepicker				
            	var timePickerObj = this.getTimePickerObj();
            	if(!timePickerObj){
            		return false;
            	};

        		if(this.settings.data.use_out_of_hours_rates === 'true'){
        			var startOfToday = '00:00';
        			var endOfToday = '11:59 PM';
        		} else {
        			var startOfToday = this.getBookingStartTime();
        			var endOfToday = this.getBookingEndTime();
        		};

				var todayDate = new Date();
	        		todayDate.setHours(0);
	        		todayDate.setMinutes(0);
	        		todayDate.setSeconds(0);
	        		todayDate.setMilliseconds(0);


            	if(selectedDate.getTime() == todayDate.getTime()){ 
            		// are we before the first booking time?
	        		var dateTimeNow = new Date();            		
            		if(dateTimeNow < startOfToday){
            		
            			//set minimum booking time
            			timePickerObj.set('min', startOfToday);//.clear(); //clear suppose if prev time selected
	            		timePickerObj.set('max', endOfToday);
            			timePickerObj.set('select', startOfToday);
					var toDisable = this.getBookedDateRanges(selectedDate);
	            		timePickerObj.set('enable', true);										
				 		timePickerObj.set('disable',toDisable);
            			return true;
            		} else {
              			// we must be between start and end booking times, set min time to current time plus interval

        				dateTimeNow.setTime(dateTimeNow.getTime() + (.5*60*60*1000)); //add half hour	     
        				var interval = parseInt(TransitQuoteProSettings.time_interval);
						var coeff = 1000 * 60 * interval;        	
						var rounded = new Date(Math.round(dateTimeNow.getTime() / coeff) * coeff)			
						timePickerObj.set('min', rounded);//.clear(); //clear suppose if prev time selected
            			timePickerObj.set('max', endOfToday);						
        				timePickerObj.set('select', rounded);
            		}
            	} else {
            		timePickerObj.set('min', startOfToday);
            		timePickerObj.set('max', endOfToday);
            	};

				var toDisable = this.getBookedDateRanges(selectedDate);

            		timePickerObj.set('enable', true);					
			 		timePickerObj.set('disable',toDisable);

			},

			getTimePickerObj: function(){
				var timePickerEl = this.getTimePickerEl();
				if(!timePickerEl){
					return false;
				};
            	var inputTime = $(this.settings.timepickerSelector).pickatime();
            	var timePickerObj = inputTime.pickatime('picker');
            	return timePickerObj;
			},

			getTimePickerEl: function(){
				var timePickerEl = $(this.settings.timepickerSelector);
				if(timePickerEl.length === 0){
					return false;
				};
				return timePickerEl;
			},

			enableTimePicker: function(){
				var timePickerEl = this.getTimePickerEl();
				$(timePickerEl).prop('disabled', false);
				$(timePickerEl).removeAttr('disabled', false);	
			},

			disableTimePicker: function(){
				var timePickerEl = this.getTimePickerEl();
				$(timePickerEl).prop('disabled', true);
				$(timePickerEl).attr('disabled', 'disabled');		
			},


			onSetTimePicker: function(context){
				if(context.select){

					var isValid = this.validateGetQuote();
					if(isValid){


						this.updateFormAction('tq_pro4_get_quote');
						this.submitFormGetQuote('get_quote');
					};
				}
			},

			initParsleyValidation: function(){
				var that = this;

				$('#quote-form').parsley({
				  	inputs: 'input, textarea, select, input[type=hidden], :hidden',
				  	excluded: 'input[type=button], input[type=submit], input[type=reset]'
				});

				$('#quote-form').parsley().on('form:error', function () {
					$.each(this.fields, function (key, field) {
		                if (field.validationResult !== true) {
		                    field.$element.closest('.bt-flabels__wrapper').addClass('bt-flabels__error');
		                }
		            });
		        });
		        $('#quote-form').parsley().on('field:validated', function () {
		            if (this.validationResult === true) {
		                this.$element.closest('.bt-flabels__wrapper').removeClass('bt-flabels__error');
		            } else {
		                this.$element.closest('.bt-flabels__wrapper').addClass('bt-flabels__error');
		            }
		        });

		        $('#quote-form').parsley().on('field:error', function () {
		        	var elName = this.$element[0].name;

		        	if(elName.indexOf('address_')!==-1){
		        		that.handleMissingAddressErrors(elName);
		        	};
		        	
		        });	
			},

			handleMissingAddressErrors: function(hiddenFieldName){
				var validationTargetInputName = hiddenFieldName.replace('country','address');
				var selector = 'input[name="'+validationTargetInputName+'"]';
				$(selector).closest('.bt-flabels__wrapper').addClass('bt-flabels__error');
				//console.log('selector for error: '+selector);
				//this.scrollToEl(selector);
			},

			initPolygons: function(){
				var that = this;

				this.loadPolygons(function(polygons){
					that.displayPolygons(polygons);
				});
			},

			loadPolygons: function(cb){
				var data = 'action=tq_pro4_load_polygons';
				$.post(this.settings.ajaxUrl, data, function(response) {
					if(response.success==='true'){
						cb(response.data);
					} else {
						$('.failure, .progress, .spinner-div').hide();
						$('.failure .msg').html(response.msg);
						$('.failure, .buttons').show();
					};
					$('.spinner-div').hide();
				}, 'json')
			},

			displayPolygons: function(polygons){
				var that = this;
				this.polygons = [];
				$.each(polygons, function(idx, polygon){
					that.displayPolygon(polygon);
				});
			},

			displayPolygon: function(polygon){
				var defCoords = google.maps.geometry.encoding.decodePath(polygon.definition);

	            var polygon = new google.maps.Polygon({
	                paths: defCoords,
	                editable: false,
	                strokeColor: '#955',
	                strokeOpacity: 0.8,
	                strokeWeight: 2,
	                fillColor: '#F55',
	                fillOpacity: 0.35,
	                surchargeId: polygon.surcharge_id,
	                surchargeName: polygon.surcharge_name
	            });

	            if(this.settings.data.show_surcharge_zones  ==='true') {
		            var map = this.calculator.getMap();
				    polygon.setMap(map);
	            };

			    this.polygons.push(polygon);
			},

			checkPolygonsForPlace: function(addressPicker){
				var that = this;

				//clear surcharge areas
				$('input[name="surcharge_areas"]').val('');								

				//loop through all addresspickers
				$.each(this.calculator.addressPickers, function(idx, addressPicker){
					var placeLatLng  = addressPicker.getPos();
					if(placeLatLng){
						$.each(that.polygons, function(idx, polygon){
							if(google.maps.geometry.poly.containsLocation(placeLatLng, polygon)){
								that.populateFormWithAreaSurchargeId(polygon);
							}
						});						
					};
				});

			},

			populateFormWithAreaSurchargeId: function(polygon){

				var surchargeAreasArray = [];
				var surchargeAreas = $('input[name="surcharge_areas"]').val();
				if(surchargeAreas!==''){
					var surchargeAreasArray = surchargeAreas.split(',');
				};

				if(surchargeAreasArray.indexOf(polygon.surchargeId)===-1){
					surchargeAreasArray.push(polygon.surchargeId);
					var surchargeStr = surchargeAreasArray.join(',');
				   	$('input[name="surcharge_areas"]').val(surchargeStr);
				};
			},

			initPayPal: function(){
				var that = this;

				paypal.Button.render({

				    env: that.settings.data.sandbox, // sandbox | production

				    // Show the buyer a 'Pay Now' button in the checkout flow
				    commit: true,

				    // payment() is called when the button is clicked
				    payment: function() {
				    	$('.paypal-msg-failure').hide();
				    	$('.paypal-msg-success').hide();
				    	var jobId = $('input[name="job_id"]').val();
				        // Set up a url on your server to create the payment_id
				        var CREATE_URL = TransitQuoteProSettings.paypal.createPaymentUrl;

						// Set up the data you need to pass to your server
						var data = {
				            jobId: jobId
				        };
		
				        // Make a call to your server to set up the payment
				        return paypal.request.post(CREATE_URL, data)
				            .then(function(res) {
				                return res.payment_id;
				            });
				    },

				    // onAuthorize() is called when the buyer approves the payment
				    onAuthorize: function(data, actions) {
				        
				        // Set up a url on your server to execute the payment
				        var EXECUTE_URL = TransitQuoteProSettings.paypal.executePaymentURL;

				        // Set up the data you need to pass to your server
				        var jobId = $('input[name="job_id"]').val();
				        var data = {
				            paymentID: data.paymentID,
				            payerID: data.payerID,
				            jobId: jobId
				        };

				        // Make a call to your server to execute the payment
				        return paypal.request.post(EXECUTE_URL, data, {timeout: 30000})
				            .then(function (response) {
				            	that.processResponseExecution(response);	
				            });
				    }

				}, '#paypal-button-container');

			},
			
			processResponseExecution: function(response){
				$('#paypal-button-container').hide();
				if(response.status === 'approved'){
					$('.paypal-msg-success').show();
				} else {
					var message = 'Unknown PayPal Error.';
					if(response.error){
						var errorData = response.error;
						if(errorData.message){
							var message = errorData.message;
						};
					};
					message = 'Your payment could not be processed because PayPal returned the following error.<br/>'+message + '<br/>Please try again or contact us for assistance.';
					$('.paypal-msg-failure').html(message);
					$('.paypal-msg-failure').show();	
					$('.buttons').show();
					
				}
			},

			processCustomerAddresses: function(){
				//convert json string to array of customer addresses indexed as per database
				var addresses = $.parseJSON(this.settings.customerAddresses);
				var indexed = [];
				$.each(addresses, function(idx,address){
					var addressId = parseInt(address.id);
					indexed[addressId] = address;
				});
				return indexed;
			},

			initEvents: function(){
				var that = this;

				$('input,select').keypress(function(event) { return event.keyCode != 13; });

				$('.tq-form').on('click', 'a.no-address', function (e) {
					e.preventDefault();
					e.stopPropagation();
					that.scrollToMap();					
					var clsParts = this.className.split('-');
					var locNo = clsParts.pop();
					that.calculator.pickLocation(locNo);
				})

				if(this.settings.data.customerAddresses){
					$('#select_address_0').on('change', function(){
						var addressId = $(this).val();
						that.updateAddress('Pick Up', addressId);
					});

					$('#select_address_1').on('change', function(){
						var addressId = $(this).val();
						that.updateAddress('Drop Off', addressId);
					});
				};

				$(this.element).on('submit', function (e) {
					e.stopPropagation();
					e.preventDefault();
				});

				$(this.element).on('click','input:submit', function(e){
					e.preventDefault();
					var btn = e.target;
					if($(that.element).parsley().validate()){
						that.onClickSubmitButton(btn);
					};
					
				});

				$(this.element).on('click','button:submit', function(e){
					e.preventDefault();
					var btn = e.target;
					that.onClickSubmitButton(btn);
		
				});

				$.listen('parsley:field:error', function(parsleyField) {
					if (parsleyField.$element.is(":hidden")) {
				        parsleyField._ui.$errorsWrapper.css('display', 'none');
				       	parsleyField.validationResult = true;
				        return true;
			    	}
				});

				this.addEventHandlerChangeVehicle();
				this.addEventHandlerChangeService();
				this.addEventHandlerDeliverReturn();
				this.addEventHandlerChangeWeight();
				return true;
			},


			addEventHandlerChangeVehicle: function(){
				var that = this;				
				$('select[name="vehicle_id"]').on('change', function(e){

					// call callback for UI updates if one exists
					that.callbackChangeVehicleId(this);
				});
			},

			addEventHandlerChangeService: function(){			
				var that = this;
				$('select[name="service_id"]').on('change', function(e){
					that.log('change: service_id');
					var val = $(this).val();

					// call callback for UI updates if one exists
					that.callbackChangeServiceId(val);
				});

			},					

			addEventHandlerDeliverReturn: function(){
				var that = this;
				$('.tq-form select[name="deliver_and_return"]').on('change', function (e) {
					var recalculate = that.quoteAlreadyCalculated();
					that.clearQuoteFields();
					that.calculator.changeDeliverReturn(this, recalculate);
				});

				$('.tq-form input[type=radio][name="deliver_and_return"]').on('change', function (e) {
					var recalculate = that.quoteAlreadyCalculated();
					that.clearQuoteFields();
					that.calculator.changeDeliverReturn(this, recalculate);
				});

				$('.tq-form input[type=checkbox][name="deliver_and_return"]').on('click', function (e) {
					var recalculate = that.quoteAlreadyCalculated();
					that.clearQuoteFields();
					that.calculator.changeDeliverReturn(this, recalculate);
				});				
			},

			addEventHandlerChangeWeight: function(){			
				var that = this;
				$('input[name="weight"]').on('change', function(e){
					that.callbackChangeWeight();
				});

				$('input[name="weight"]').keyup(this.keyupDelay(function (e) {
					that.callbackChangeWeight();
				}, 500));

			},			

			quoteAlreadyCalculated: function () {
				//has quote been generated
				var totalCost = $('input[name="total"]').val();
				if (!totalCost) {
					return false;
				} else {
					return true;
				}
			},

			scrollToMap: function(){
					$('html, body').animate({
					    scrollTop: ($('#map').offset().top)
					},500);
			},

			onClickSubmitButton: function(btn){
				var submitType = $(btn).val();
				switch(submitType){
					case 'get_quote':
						if(this.validateGetQuote()){
							this.updateFormAction('tq_pro4_get_quote');
							this.submitFormGetQuote(submitType);
						};
						break;
					case 'pay_method_1':
						if($(this.element).parsley().validate()){
							this.updateFormAction('tq_pro4_save_job');
							this.submitForm(submitType);
						};
						break;
					case 'pay_method_2':
					case 'pay_method_3':
					case 'pay_method_4':

						if($(this.element).parsley().validate()){
							this.updateFormAction('tq_pro4_pay_now');
							this.submitForm(submitType);
						};
					break;			
				}
			},

			validateGetQuote: function(){
				// if journey fails checkjourneyRestrictions distance will be blank or 0
				var distance = $('input[name="distance"]').val();
				if(isNaN(distance)){
					this.log('distance isNan');
					return false;
				};
				if(distance == 0){
					this.log('distance 0');
					return false;
				};
				if(distance === ''){
					this.log('distance empty');
					return false;
				};

				var deliveryTime = $('input[name="delivery_time"]').val();
				if(deliveryTime === ''){
					this.log('deliveryTime empty');
					return true;
				};

				var deliveryDate = $('input[name="delivery_date"]').val();
				if(deliveryDate === ''){
					this.log('deliveryDate empty');
					return false;
				};			
				var routeData = this.calculator.getMapData();
				if(!routeData){
					this.log('no routeData');
					return false;
				};
				var routeData = this.calculator.getMapData();
				if(!routeData.response){
					this.log('no routeData response: ');

					return false;
				};
		
				var routeData = this.calculator.getMapData();
				if(!routeData.response.routes){
					this.log('no routeData response routes');
					return false;
				};
				var routeData = this.calculator.getMapData();
				if(!routeData.response.routes[0]){
					this.log('no routeData response route 0');
					return false;
				};

				if(!this.calculator.routeIsValid()){
					return false;
				}


				return true;
			},

			submitFormGetQuote: function(submitType){
				var that = this;
				var valid = true;
			/*	$('.addresspicker').each(function(index){
					var val = $(this).val();
					console.log('index: '+index);
					console.log('validateGetQuote val: ',val);
					if(!val){
						valid = false;
						return false;
					} else {
						console.log('index OK: '+index);

					}
				});
				console.log('after validation:' + valid);*/
				$('.failure').hide();
				var progressMessage = this.getProgressMsgForSubmitType(submitType);
				this.updateProgressMessage(progressMessage);
				$('.buttons').hide();
				$('.paypal-msg-failure').hide();

				var routeData = this.calculator.getMapData();

				var route = $.extend({},routeData.response.routes[0]);
				var legs = route.legs;
				var trimmedLegs = [];
				$.each(legs, function(idx, leg){
					var trimmed = $.extend({},leg);
					delete trimmed.steps
					trimmedLegs.push(trimmed);
				});

				//serialize form
				var data = $(this.element).serialize();
					//add button value to determine if request is for a quote or payment
					data += '&submit_type='+submitType;
					data += '&directions='+encodeURIComponent(JSON.stringify(trimmedLegs));
				$.post(this.settings.ajaxUrl, data, function(response) {
					if(response.success==='true'){
						that.submissionSuccess(response, submitType);
					} else {
						$('.failure, .progress, .spinner-div').hide();
						$('.failure .msg').html(response.msg);
						$('.failure, .buttons').show();
					};
					$('.spinner-div').hide();
				}, 'json');
			},

			submitForm: function(submitType){
				var that = this;
				$('.failure').hide();
				var progressMessage = this.getProgressMsgForSubmitType(submitType);
				this.updateProgressMessage(progressMessage);
				$('.buttons').hide();
				$('.paypal-msg-failure').hide();

				if(!this.quoteId){
					return false
				};
				//serialize form
				var data = $(this.element).serialize();
					//add button value to determine if request is for a quote or payment
					data += '&submit_type='+submitType;
					data += '&quote_id='+String(this.quoteId);
					data += '&journey_id='+String(this.journeyId);					

				$.post(this.settings.ajaxUrl, data, function(response) {
					if(response.success==='true'){
						that.submissionSuccess(response, submitType);
					} else {
						$('.failure, .progress, .spinner-div').hide();
						$('.failure .msg').html(response.msg);
						$('.failure, .buttons').show();
					};
					$('.spinner-div').hide();
				}, 'json');
			},

			getProgressMsgForSubmitType: function(submitType){
				switch(submitType){
					case 'get_quote':
						return 'Calculating Estimated Delivery Cost..';
					break;
					case 'book_delivery':
						return 'Sending your request to our staff..';
					break;
					case 'pay_method_1':
					case 'pay_method_2':
					case 'pay_method_3':
					case 'pay_method_4':
						return this.settings.data.processing_payment;
					break;
				}
			},

			submissionSuccess: function(response, submitType){
				var that = this;

				this.hideStatusMessages();
				switch(submitType){
					case 'get_quote':
						this.processSubmissionSuccessResponseGetQuote(response);
					break;
					case 'book_delivery':
						this.processSubmissionSuccessResponseOnDelivery(response);
						
					break;
					case 'pay_method_1':
						this.processSubmissionSuccessResponseOnDelivery(response);
					case 'pay_method_2':
					case 'pay_method_3':
					case 'pay_method_4':
						this.processSubmissionSuccessWooCommerce(response);
					break;
				};
				
			
			},

			processSubmissionSuccessResponseGetQuote: function(response){

				if(response.data.quote){
					this.populateQuoteFields(response.data.quote);
					this.populateBreakdown(response.data.html);
					this.showQuoteFields();
					this.quoteId = response.data.quote.id;
					this.journeyId = response.data.journey.id;
					if(response.data.booking_range){
						this.processBookingStatus(response.data.booking_range);
					};
				} else {
					$('.failure .msg').html('Unable to calculate quote.');
					$('.failure').show();
				}
			},

			processBookingStatus: function(bookingTimeResponse){
				if(String(bookingTimeResponse.available)==='true'){
					$('#tq-date-warning').hide();
					$('#tq-date-warning').html();
				} else {
					$('#tq-date-warning').html(bookingTimeResponse.message);					
					$('#tq-date-warning').show();
				}
			},

			populateBreakdown: function(html){
				if(!html){
					var html = '';
				};
				$('.quote-breakdown').html(html);
			},

			processSubmissionSuccessResponseOnDelivery: function(response){
				var that = this; 

				if(response.data.job_id){
					this.populateFormWithJobId(response);
					$('.on-delivery').show();
					$('.on-delivery-msg-succcess').html(response.success_message);
					$('.tq-form-fields-container').hide();	
					$('#quote-form').hide();
				} else {
					$('.failure .msg').html('Unable to book your job.');
					$('.failure').show();
				}
			},	

			processSubmissionSuccessWooCommerce: function(response){
				if(response.data.job_id){
					this.populateFormWithJobId(response);
					var paymentMethod = this.getPaymentMethodFromResponse(response);
					var wooCommerceFormData = this.getWooCommerceFormData(response.data);
					if(this.haveRequiredWooCommerceData(wooCommerceFormData)){
						this.createHiddenWooCommerceForm(wooCommerceFormData);
						this.submitHiddenWooCommerceForm();
					};
				} else {
					$('.failure .msg').html('Unable to book your job.');
					$('.failure').show();
				}
			},

			haveRequiredWooCommerceData: function(wooCommerceFormData) {
				if( (wooCommerceFormData.productId) &&
					(wooCommerceFormData.jobId) &&
					(wooCommerceFormData.firstName) &&
					(wooCommerceFormData.lastName) &&
					(wooCommerceFormData.email)) {
					return true;
				} else {
					return false;
				}
			},

			getWooCommerceFormData: function(responseData){
				// init non required proerties to to empty string
				var formData = {phone: '',
								description: '',
								addToCardRedirectUrl:''};

					formData.firstName = $('.bt-flabels__wrapper input[name="first_name"]').val();
					formData.lastName = $('.bt-flabels__wrapper input[name="last_name"]').val();
					formData.phone = $('.bt-flabels__wrapper input[name="phone"]').val();
					formData.email = $('.bt-flabels__wrapper input[name="email"]').val();
					formData.description = $('.bt-flabels__wrapper textarea[name="description"]').val();

					if(responseData.product_id){
						formData.productId = responseData.product_id;						
					};
					if(responseData.job_id){
						formData.jobId = responseData.job_id;		
					};
					if(responseData.add_to_cart_redirect_url){
						formData.addToCardRedirectUrl = responseData.add_to_cart_redirect_url;						
					};

				return formData;
			},


			submitHiddenWooCommerceForm: function(){
				$('#woocommerce_paynow').submit();						
			},

			keyupDelay: function(callback, ms) {
			  var timer = 0;
			  return function() {
			    var context = this, args = arguments;
			    clearTimeout(timer);
			    timer = setTimeout(function () {
			      callback.apply(context, args);
			    }, ms || 0);
			  };
			},

			populateQuoteFields: function(quote){

				$('.totalCost').html(quote.total);
				$('.basicCost').html(quote.subtotal);
				$('.rateTax').html(quote.rate_tax);
				$('.taxCost').html(quote.tax_cost);
				$('.hourCost').html(quote.time_cost);
				$('.weightCost').html(quote.weight_cost);

				if(quote.area_surcharges_cost){
					$('.areaCost').html(quote.area_surcharges_cost);
					$('.areaCost').show();
				};
				$('.job-rate').html(quote.job_rate + ' rate');

				$('input[name="distance_cost"]').val(quote.distance_cost);
				$('input[name="total"]').val(quote.total);
				$('input[name="rate_tax"]').val(quote.rate_tax);
				$('input[name="tax_cost"]').val(quote.tax_cost);
				$('input[name="basic_cost"]').val(quote.basic_cost);
				$('input[name="time_cost"]').val(quote.time_cost);
				$('input[name="weight_cost"]').val(quote.weight_cost);
				$('input[name="job_rate"]').val(quote.job_rate + ' rate');
				$('#breakdown').val(JSON.stringify(quote.breakdown));
			},

			clearQuoteFields: function(){
				$('.tq-form .quote-currency').hide();
				$('.totalCost').html('Calculating..');
				$('.basicCost').html('');
				$('.rateTax').html('');
				$('.taxCost').html('');
				$('.hourCost').val('');
				$('span#jobRate').html('');

				$('input[name="distance_cost"]').val('');
				$('input[name="total"]').val('');
				$('input[name="rate_tax"]').val('');
				$('input[name="tax_cost"]').val('');
				$('input[name="basic_cost"]').val('');
				$('#breakdown').val('');
			},

			showQuoteFields: function(){
				$('.tq-form .quote-currency').show();
				$('.quote-fields').removeClass('hidden');
				$('.quote-fields').show();
				$('.quote-success').show();
				$('.success.buttons').show();
				$('.tq-form-fields-container').show();
				$('.tq-form-fields-container').removeClass('hidden');
			},

			getPaymentMethodFromResponse: function(response){
				if(this.hasValidPaymentMethod(response)){
					var paymentMethod = this.getPaymentMethodFromResponse(response);
						return parseInt(paymentMethod);
				} else {
					return false;
				}
			},

			hasValidPaymentMethod: function(response){
				if(this.hasPaymentMethod(response)){
					if(this.paymentMethodIsValid(response.payment_method)){
						return true;
					};
				};

				return false;
			},

			hasPaymentMethod: function(response){
				if(typeof(response.payment_method)!=='undefined'){
					return true;					
				};
				return false;
			},

			paymentMethodIsValid: function(paymentMethod){
				if(isNaN(parseInt(paymentMethod))){
					return false;
				};
				return true;
			},

			getPaymentMethodFromResponse: function(response){
				var paymentMethod = parseInt(response.payment_method);
				return paymentMethod;
			},

			hideStatusMessages: function(){
				$('.failure, .progress, .spinner-div').hide();
			},

			showSuccessMessage: function(){
				$('.success').show();
			},

			populateFormWithJobId: function(response){
				$('input[name="job_id"]').val(response.data.job_id);
			},

			createHiddenWooCommerceForm: function(data){
			
				var form = $('<form method="post" id="woocommerce_paynow" action="'+data.addToCardRedirectUrl+'?add-to-cart=' + data.productId + '&dynamic_price=true&jid=' + data.jobId + '">' +
				  '<input type="hidden" name="job_id" value="' + data.jobId + '" />' + 
				  '<input type="hidden" name="billing_first_name" value="' + data.firstName + '" />' + 
				  '<input type="hidden" name="billing_last_name" value="' + data.lastName + '" />' + 
				  '<input type="hidden" name="billing_phone" value="' + data.phone + '" />' + 
				  '<input type="hidden" name="billing_email" value="' + data.email + '" />' + 
				  '<input type="hidden" name="order_comments" value="' + data.description + '" />' + 
				  '<input type="hidden" name="autofill" value="true" />' + 
				  '</form>' );
				$('#woocommerce').append(form);
			},

			showPaymentButton: function(paymentMethod, data){
				switch(paymentMethod){
					case 1:

						$('.on-delivery').show();
					break;
					case 2:
						$('.paypal-msg-failure').hide();
						$('#paypal').show();
						$('#paypal-button-container').show();
						if(!this.payPalInitialized){
							this.payPalInitialized = true;
							this.initPayPal();

						};
						
					break;
					case 3:
						
					break;
				}
			},

			log: function(data){
				if(this.settings.debug){
					console.log(data);
				}
			},

			updateAddress: function(addressType, addressId){
				//get address details
				var address = this.customerAddresses[addressId];
				if(!address){
					this.log('No details for address: ' + address);
					return false;
				};

				//Add address text to search box
				switch(addressType){
					case 'Pick Up':
						$('#address_0').val(address.address);
					break;
					case 'Drop Off':
						$('#address_1').val(address.address);
						var deliveryName = (address.delivery_contact_name)?address.delivery_contact_name:'';
						$('#delivery_name').val(deliveryName);
					break;
				}
				//populate the calculator
				this.calculator.setAddress(addressType, address);

				//update form with location data
				this.calculator.updateForm(addressType);

				//check if route is now available
				this.calculator.checkForRoute();	
			},

			updateFormAction: function(formAction){
				$('form.tq-form input[name="action"]').val(formAction);
			},

			updateProgressMessage: function(msg){
				$('.progress p').html(msg);
				$('.progress').show();
			}

		};

		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
