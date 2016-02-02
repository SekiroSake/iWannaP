
	var infowindow = null;
	var infoWindowContent ;
	var filteredPlaces;
	var marker;

	//Set Variables in JSON
	var places = [
		{
			name: 'Public Restroom',
			address: '340 Sea Cliff Ave, San Francisco, CA 94121',
			lat: 37.787938,
			lng: -122.490947,
			info: 'Beach park,public restroom',
			tags: ['public restroom','beach'],
			hours: '10:00 AM - 6:00 PM'
		},
		{
			name: 'Bandstand Public Restrooms',
			address: '78 Music Concourse Dr, San Francisco, CA 94118',
			lat: 37.770282,
			lng: -122.466758,
			info: 'Financial District,public restroom',
			tags: ['public restroom'],
			hours: '24 hours',
		},
		{
			name: 'Restroom',
			address: 'The Presidio of San Francisco,991–999 Marine Dr,San Francisco, CA  94129',
			lat: 37.805434,
			lng: -122.467036,
			info: 'Financial District,public restroom',
			tags: ['public restroom'],
			hours: '9:00 AM - 5:00 PM',
		},
		{
			name: 'Embarcadero Center',
			address: 'Embarcadero Ctr,San Francisco, CA 94111',
			lat: 37.794873,
			lng: -122.397892,
			info: 'Embarcadero Ctr,in shopping center',
			tags: ['shopping center'],
			hours: '24 hours',
		},
		{
			name: 'San Francisco Main Library',
			address: '100 Larkin St,San Francisco, CA 94102',
			lat: 37.779116,
			lng: -122.415766,
			info: 'Civic Center,in the library',
			tags: ['public restroom', 'library'],
			hours: '10:00 AM - 6:00 PM',
		},
		{
			name: 'Dolores Park',
			address: 'Dolores St,San Francisco, CA 94114',
			lat: 37.767643,
			lng: -122.426929,
			info: 'Castro,public restroom',
			tags: ['public restroom', 'park'],
			hours: '9:00 AM - 5:00 PM',
		},
		{
			name: 'Golden Gate Park',
			address: 'Transverse Dr, San Francisco, CA 94121',
			lat: 37.771373,
			lng: -122.480863,
			info: 'public restroom, park',
			tags: ['public restroom', 'park'],
			hours: '24 hours',
		},
		{
			name: 'Alamo Square',
			address: 'Steiner St & Hayes St,San Francisco, CA 94115',
			lat: 37.775639,
			lng: -122.432835,
			info: 'public restroom, park',
			tags: ['public restroom', 'park'],
			hours: '9:00 AM - 5:00 PM',
		},
		{
			name: 'McCoppin Square',
			address: '1300 Taraval St,San Francisco, CA 94116',
			lat: 37.742876,
			lng: -122.479990,
			info: 'public restroom,Parkside',
			tags: ['public restroom', 'park'],
			hours: '9:00 AM - 5:00 PM',
		},
		{
			name: 'Crissy Field',
			address: '603 Mason St,San Francisco, CA 94129',
			lat: 37.803895,
			lng: -122.455526,
			info: 'Marina/Cow Hollow,beach park',
			tags: ['public restroom', 'park','beach'],
			hours: '24 hours',
		}
	];
	/*
	var Yelp = require('yelp');
	var yelp = new Yelp({
  	consumer_key: 'jrnlJEwrdWeAaQA8I7Z9vQ',
  	consumer_secret: 'RSH_lXYDJoHl_-uz3Y1ZHoLVaNM',
  	token: 'l39ZS1UiefD3J8AbdYx0z11hiXDVuwXX',
  	token_secret: 'sZgmkuwbU7Kv7aUu-vMD5bQpJa0',
	});
	*/


	/*
	Set the starting focus point on google map
	Ping on the Centre of San Francisco
	*/

	var gMap = {
		map: {},
		//infoWindow: new google.maps.InfoWindow(), // reusable info window
		options: {
			center: { lat: 37.759819, lng: -122.426036},
			zoom: 12
		},
		//this variable might be super long, but also super important

		/*init: function(vm) {
			gMap.map = new google.maps.Map(document.getElementById('map'), gMap.options);
			// shows markers depending on which loads faster - vm or google map
			if (vm.initialized && !vm.hasMarkers) vm.showMarkers();
		}*/
	};

	function initMap() {
		gMap.map = new google.maps.Map(document.getElementById('map'), gMap.options);
		infoWindow =  new google.maps.InfoWindow();
		infoWindowContent =  '<div class="info-window">'+
						    '<div class="window-title">%title%</div>'+
						    '<div class="window-description">%description%</div>'+
							'<div class="window-open">%open%</div><div class="window-open">'+
							'<h5>Outside look:</h5>'+
							'</br><img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&'+
							'location=%lat1%,%lng1%&heading=151.78'+
							'&pitch=-0.76&key=AIzaSyBexCRG32sL2vBuJWpbCgHNkahtEPm3lTA"'+
							' alt="view image" style="width:304px;height:228px;"></br>'+
							'</br><h5>Nearby place recommendation:</h5>'+'</br>%apiinfo%</div></div>';
		var vm = new ViewModel();
		vm.init();
		if (vm.initialized && !vm.hasMarkers) vm.showMarkers();
		ko.applyBindings(vm);
	};

	// Set place
	var Place = function(data, parent) {
		// info from provided data model
		this.name = ko.observable(data.name);
		this.info = ko.observable(data.info);
		this.address = ko.observable(data.address);
		this.tags = ko.observableArray(data.tags);
		this.lat = ko.observable(data.lat);
		this.lng = ko.observable(data.lng);
		this.hours = ko.observable(data.hours);

		// if this place has extra info via ajax
		this.initialized = ko.observable(false);

		// google maps marker
		 marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			icon: 'img/marker.png',
			draggable: true,
    		animation: google.maps.Animation.DROP,
		});


		// click handler for google maps marker
		google.maps.event.addListener(marker, 'click', (function(place, parent) {
			return function() {
				// tell viewmodel to show this place
				parent.toggleBounce(place);
				//parent.showPlace(place);
				parent.changeMarker(place);
				parent.getAPIinfo(place);
			};
		}) (this, parent));
		this.marker = marker;
	};



	/*for marker animation
	function toggleBounce() {
  		if (marker.getAnimation() !== null) {
    		marker.setAnimation(null);
  		} else {
    			marker.setAnimation(google.maps.Animation.BOUNCE);
  			}
	}*/

	//set fil
	var Filter = function(data) {
		this.name = ko.observable(data.name);
		this.on = ko.observable(true);
	};

	//VIEWMODEL
	var ViewModel = function() {
		var self = this;
		self.searchFilter = ko.observable('');
		self.currentPlace = ko.observable();
		self.initialized = false;
		self.hasMarkers = false;
		self.connectionError = ko.observable(false);

		//init
		self.init = function() {
			var tempTagArr = [];
			var tempFilterArr = [];
			self.placeList = ko.observableArray([]);
			places.forEach(function(place) {
				self.placeList.push(new Place(place, self));

				place.tags.forEach(function(tag){

					if (tempTagArr.indexOf(tag) < 0) {
						tempTagArr.push(tag);
					}
				});// end tag loop
			});// end place loop

			// loop through tags and make filter objects from them
			tempTagArr.forEach(function(tag){
				tempFilterArr.push(new Filter({name: tag}));
			});

			self.filters = ko.observableArray(tempFilterArr);

			// array of filters currently applied
			self.currentFilters = ko.computed(function() {
				var tempCurrentFilters = [];

				// loop through filters and get all filters that are on
				ko.utils.arrayForEach(self.filters(), function(filter){
					if (filter.on()) tempCurrentFilters.push(filter.name());
				});

				return tempCurrentFilters;
			});

			// array of places to be shown based on currentFilters

			self.filteredPlaces = ko.computed(function() {
				var tempPlaces = ko.observableArray([]);
				var returnPlaces = ko.observableArray([]);

				// apply filter
				ko.utils.arrayForEach(self.placeList(), function(place){
					var placeTags = place.tags();

					// loop through all tags for a place and
					// determine if any are also a currently applied filter
					var intersections = placeTags.filter(function(tag){
						return self.currentFilters().indexOf(tag) != -1;
					});

					// if one or more tags for a place are in a filter, add it
					if (intersections.length > 0) tempPlaces.push(place);
				});

				var tempSearchFilter = self.searchFilter().toLowerCase();

				// if there is no additional text to search for, return filtered places
				if (!tempSearchFilter){
					returnPlaces = tempPlaces();
				}
				// if user is also searching via text box, apply text filter
				else{
					returnPlaces = ko.utils.arrayFilter(tempPlaces(), function(place) {
			        	return place.name().toLowerCase().indexOf(tempSearchFilter) !== -1;
			        });
				}

				// hide/show correct markers based on list of current places
				self.filterMarkers(returnPlaces);
				return returnPlaces;

			});

			// if no markers have been shown, show them
			if (!self.hasMarkers) self.showMarkers();
			self.initialized = true;
		};

		// shows/hides correct map markers
		self.filterMarkers = function(filteredPlaces) {
			ko.utils.arrayForEach(self.placeList(), function(place){
				if (filteredPlaces.indexOf(place) === -1) {
					place.marker.setVisible(false);
				}
				else{
					place.marker.setVisible(true);
				}
			});
		};

		// turns filter on or off
		// called when filter is clicked in view
		self.toggleFilter = function(filter) {
			filter.on(!filter.on());
		};

		// show the currently selected place
		// called when list item or map marker is clicked
		/*
		function streetview() {
	  var fenway = {lat: 42.345573, lng: -71.098326};
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: fenway,
	    zoom: 14
	  });
	  var panorama = new google.maps.StreetViewPanorama(
	      document.getElementById(''), {
	        position: fenway,
	        pov: {
	          heading: 34,
	          pitch: 10
	        }
	      });
	  map.setStreetView(panorama);
	}*/
		//set up viewd marker

		self.changeMarker = function(place){
			place.marker.setIcon('img/marker_selected.png');
		};
		self.toggleBounce = function(place) {
  			if (place.marker.getAnimation() !== null) {
    			place.marker.setAnimation(null);
  				} else {
    					place.marker.setAnimation(google.maps.Animation.BOUNCE);
    					setTimeout(function(){ place.marker.setAnimation(null); }, 750);
  					   }
		}
		self.the4Sstring = '';

		/*
		get required info from 4 square api
		*/
		this.getAPIinfo = function (place){
			var url = 'https://api.foursquare.com/v2/venues/search?ll=' +
			place.lat() + ',' + place.lng() +
			'&intent=checkin&radius=1&&client_id=' +
			'X4VJ1VD5FWQOBAXS3TW4BB5FJCFWHKOIWKKORHKFK2E0GZ2O&'+
			'client_secret=LJCJ1WQLLVGKWICTYZWASUWLNUQM1ZJJRS13QXP4BQTO1VNT&v=20131118';

			/*
			return the request for infowindow
			*/

			$.getJSON(url)
				.done(function (data) {
						self.the4Sstring = '';
						var venue = data.response.venues[1];
					//set fetched info as properties of Place object
						//place.id = ko.observable(venue.id);
						if (venue.hasOwnProperty('name')) {
							//place.name = ko.observable(venue.name);
							self.the4Sstring = self.the4Sstring + 'Name: ' +
                        venue.name;
						}else {
							self.the4Sstring = self.the4Sstring + '</br>Name not found';
						}
						if (venue.hasOwnProperty('location')&& venue.location.hasOwnProperty('address')) {
							//place.address = ko.observable(venue.location.address);
							self.the4Sstring = self.the4Sstring + '</br>Address: ' +
                        venue.location.address;
						}else {
							self.the4Sstring = self.the4Sstring + '</br>Location not found';
						}
						if (venue.hasOwnProperty('contact') && venue.contact.hasOwnProperty('formattedPhone')) {
							//self.the4Sstring = ko.observable(venue.contact.formattedPhone);
							self.the4Sstring = self.the4Sstring + '</br>Phone: ' +
                        venue.contact.formattedPhone;
						}else {
							self.the4Sstring = self.the4Sstring +  '</br>Phone not found';
						}
						self.showPlace(place);

				})
				.fail(function(){
					 //self.connectionError(true);
					 self.the4Sstring = 'Error: Fouresquare info did not loaded';
					 self.showPlace(place);
				});
			};

		var streetimage = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=46.414382,10.013988&heading=151.78&pitch=-0.76&key=AIzaSyBexCRG32sL2vBuJWpbCgHNkahtEPm3lTA";
		self.showPlace = function(place) {
			// set info window content and show it
			infoWindow.setContent(infoWindowContent.replace('%apiinfo%',self.the4Sstring).replace('%title%', place.name()).replace('%description%', place.address()).replace('%open%', 'Open: ' + place.hours()).replace('%lat1%', place.lat()).replace('%lng1%', place.lng()));

			infoWindow.open(gMap.map, place.marker);


			if (self.currentPlace()) self.currentPlace().marker.setIcon('img/marker.png');
			//streetview();

			// reset error status
			self.connectionError(false);

			/*ajax
			if (!place.initialized()) {
				// set current place and scroll user to information
				// call to get initial information
				$.ajax({
						url: 'https://api.foursquare.com/v2/venues/search?ll=' + place.lat() + ',' + place.lng() + '&intent=checkin&radius=1&&client_id=X4VJ1VD5FWQOBAXS3TW4BB5FJCFWHKOIWKKORHKFK2E0GZ2O&client_secret=LJCJ1WQLLVGKWICTYZWASUWLNUQM1ZJJRS13QXP4BQTO1VNT&v=20131118'
					})
					.done(function (data) {

						var venue = data.response.venues[1];
					//set fetched info as properties of Place object
						//place.id = ko.observable(venue.id);
						if (venue.hasOwnProperty('name')) {
							place.name = ko.observable(venue.name);
						}else {
							place.name = 'Name not found';
						}
						if (venue.hasOwnProperty('location')&& venue.location.hasOwnProperty('address')) {
							place.address = ko.observable(venue.location.address);
						}else {
							place.address = 'Location not found';
						}
						if (venue.hasOwnProperty('contact') && venue.contact.hasOwnProperty('formattedPhone')) {
							place.phone = ko.observable(venue.contact.formattedPhone);
						}else {
							place.phone = 'Phone not found';
						}




						self.currentPlace(place);
						self.scrollTo('#info-container');

                        })
                        .fail(function(err) {
							// if there is an error, set error status and scroll user to the info
                            self.connectionError(true);
                            self.scrollTo('#info-container');
                        });
                    }

                    else {
						// set current place and scroll user to information
						self.currentPlace(place);
						self.scrollTo('#info-container');
					}
					*/

				};
                         // helper function to scroll user to specified element
                    // el is a string representing the element selector
 			self.scrollTo = function(el) {

				$('html, body').animate({ scrollTop: $("#control-bar").offset().top }, "slow");
				};
                    // show marker for each place
      self.showMarkers = function() {
				ko.utils.arrayForEach(self.placeList(), function(place){
				place.marker.setMap(gMap.map);
			});

			self.hasMarkers = true;
		};
	};


	// empty view model
	//var vm = new ViewModel();

	/* listener for view model initialization
	$( document ).ready(function() {
		vm.init();
		ko.applyBindings(vm);


		// resize map and reset center when window size changes
		$(window).on('resize', function() {
			google.maps.event.trigger(gMap.map, 'resize');
			gMap.map.setCenter(gMap.options.center);
		});
	});
	// listener for google map initialization
	google.maps.event.addDomListener(window, 'load', gMap.init(vm));
	*/
