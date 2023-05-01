(function ( $ ) {

	$.fn.AddressPicker = function AddressPicker(options) {

		// default settings of AddressPicker class
		var defaults = {
			autoComplete: null,
			infoWindow: null,
			infoWindow: null,
			inputElId: null
		};

		this.settings = $.extend({}, defaults, options);
		this.pos = null;
		this.address = '';
	};

	$.fn.AddressPicker.prototype = {
		init: function () {
			// this.log('init AddressPicker');
			this.inputEl = this.getInputEl();

			if (!this.inputEl) {
				// this.log('no inputEl');
				return false;
			};
			this.setPos(this.settings.pos);
			this.marker = this.initMarker();
			this.infoWindow = this.initInfoWindow();
			this.autoComplete = this.initAutoComplete();
			this.geocoder = this.settings.geocoder;
			this.place = null;
			this.initPlaces();
		},

		initMarker: function (markerOptions) {

			var markerOptions = (markerOptions) ? markerOptions : {};
			var markerOptions = $.extend({
				anchorPoint: new google.maps.Point(0, -29),
				draggable: this.settings.draggableMarker,
				map: this.settings.map,
				position: this.settings.mapOptions.center,
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

		initAutoComplete: function () {
			var input = document.getElementById(this.settings.inputElId);
			if (!input) {
				return false;
			};

			var options = {
			};

			if ((this.settings.countryCode) && (this.settings.restrictToCountry ==='true')) {
				//console.log('using restrictToCountry: '+this.settings.countryCode);
				options.componentRestrictions = { country: this.settings.countryCode }
			};


			if (this.settings.searchRadius) {
			//	console.log('using searchRadius: '+this.settings.searchRadius);

				if (!isNaN(this.settings.searchRadius)) {
					if (this.settings.searchRadius > 0) {
						var circle = new google.maps.Circle({
							center: this.settings.location,
							radius: (1000 * parseInt(this.settings.searchRadius))
						});

						options.bounds = circle.getBounds();
						options.strictBounds = true;
					}
				}


			};

			var autocomplete = new google.maps.places.Autocomplete(input, options);

		    var observerHack = new MutationObserver(function() {
		        observerHack.disconnect();
		        input.setAttribute("autocomplete", "new-password");
		    });

		    observerHack.observe(input, {
		        attributes: true,
		        attributeFilter: ['autocomplete']
		    });

			return autocomplete;
		},

		initInfoWindow: function () {
			// this.log('initInfoWindow');
			return new google.maps.InfoWindow();
		},

		autofillCollectionMap: function (index) {
			// for collection address set marker 
			if (index == 0) {
				var lat = $("#address_0_lat").val();
				var lng = $("#address_0_lng").val();
				if ((lat != undefined && lng != undefined) || (lat != '' && lng != '')) {
					var that = this;
					var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
					this.geocoder.geocode({ 'location': latlng }, function (results, status) {
						if (status === 'OK' && results[0]) {
							var place = results[0];
							that.setPlace(place);
							var address = that.getAddressFromComponents(place.address_components);
							that.setAddress(address);
							that.hideInfoWindow();
							that.hideMarker();
							that.setPos(place.geometry.location);
							that.setMarkerPos(place.geometry.location);
							that.showMarker();
							that.setMarkerInfoWindow();
							that.settings.placeChangeCallback(that, place, that.getIndex());
						}
					});
				}
			}
		},

		hasFixedStartCoords: function(){
			var lat = $("#address_0_lat").val();
			var lng = $("#address_0_lng").val();
			if(isNaN(parseFloat(lat))||(isNaN(parseFloat(lng)))){
				return false;
			};
			return true;
		},		

		initPlaces: function () {
			// this.log('start initPlaces');
			var that = this;
			if(this.hasFixedStartCoords()){
				this.autofillCollectionMap(this.getIndex());
			}

			// Event handler for changed place selection in drop down box
			google.maps.event.addListener(this.autoComplete, 'place_changed', function () {
				//place spefic stuff
				var place = this.getPlace();
				if (!place) {
					return;
				};
				if (!place.geometry) {
					return;
				};
				that.setPlace(place);
				var address = that.getAddressFromComponents(place.address_components);
				that.setAddress(address);
				that.hideInfoWindow();
				that.hideMarker();
				that.setPos(place.geometry.location);
				that.setMarkerPos(place.geometry.location);
				that.showMarker();
				that.setMarkerInfoWindow();
				that.settings.placeChangeCallback(that, place, that.getIndex());
			});
			// this.log('initPlaces');
		},

		getAddressFromComponents: function (address_components) {
			if (!address_components) {
				return '';
			};
			var address = [
				(address_components[0] && address_components[0].short_name || ''),
				(address_components[1] && address_components[1].short_name || ''),
				(address_components[2] && address_components[2].short_name || '')
			].join(' ');

			return address;
		},

		getIndex: function () {
			return this.index;
		},

		getInputEl: function () {
			// return jQuery ref for input el if it exists
			var inputEl = $('#' + this.settings.inputElId);
			// this.log(inputEl);
			if (inputEl.length == 1) {
				// this.log('have input');
				return inputEl;
			};
			return false;
		},

		getAddressForPosition: function (callback) {
			this.reverseGeocode(function (addressResult) {
				var address = false;
				if (addressResult) {
					if (addressResult[0]) {
						address = addressResult[0];
					};
				};
				callback(address);
			})
		},


		reverseGeocode: function (callback) {
			var that = this;
			if (this.pos) {
				this.geocoder.geocode({ 'latLng': this.pos }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							callback(results);
						}
					}
				});
			} else {
				callback(false);
			};

		},

		getAddressPosition: function (address) {

			//get gmaps position from json array such as db address rec
			if (!address) {
				this.log('no address');
				return false;
			};

			if (!address.lat) {
				this.log('no address lat');
				return false;
			};

			if (!address.lng) {
				this.log('no address lng');
				return false;
			};
			var pos = new google.maps.LatLng(address.lat, address.lng);
			if (!pos) {
				return false;
			};
			return pos;

		},

		getAddressTypeLabel: function () {
			var addressTypeLabel = 'Destination';
			if (this.index == 0) {
				addressTypeLabel = 'Collection';
			};
			return addressTypeLabel;
		},

		getMarker: function () {
			return this.marker;
		},

		getPos: function () {
			return this.pos;
		},

		getPlace: function () {
			return this.place;
		},

		getPlaceId: function () {
			if (!this.place) {
				return false;
			};
			var place = this.getPlace();
			return this.place.place_id;
		},

		hideInfoWindow: function () {
			this.infoWindow.close();
		},

		hideMarker: function () {
			this.hideInfoWindow();
			this.marker.setVisible(false);
		},

		populateHiddenJourneyOrderInput: function (journeyOrder) {
			$('#address_' + this.index + '_journey_order').val(journeyOrder);
		},

		setAddress: function (address) {
			if (!address) {
				return false;
			};
			this.address = address;
		},

		getAddress: function(){
			return this.address;
		},

		setAddresInputFromAddress: function () {
			$(this.inputEl).val(this.address);
		},

		setRawAddress: function (rawAddress) {
			this.rawAddress = rawAddress;
		},

		setMarkerDraggable: function (draggable) {
			this.marker.setDraggable(draggable);
		},

		setMarkerPos: function (position) {
			//set marker location
			this.marker.setPosition(position);
		},

		showMarker: function () {
			this.marker.setVisible(true);
		},

		setMarkerInfoWindow: function (message) {
			if ((this.address) || (message)) {
				var addressTypeLabel = this.getAddressTypeLabel();
				var content = '<div class="pop-up"><strong>' + addressTypeLabel + '</strong><br/>' + this.address;
				if (message) {
					content = message;
				};
				this.infoWindow.setContent(content);
				this.infoWindow.open(this.settings.map, this.marker);
			};
		},

		setIndex: function (idx) {
			this.index = idx;
		},

		setPos: function (pos) {
			if (!pos) {
				return false;
			};
			this.pos = pos;
		},

		setPlace: function (place) {
			this.place = place;
		},

		setPosFromMarker: function () {
			this.pos = this.marker.getPosition();
		}
	};

}(jQuery));