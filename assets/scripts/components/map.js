(function(addon) {

	var component;

	if (window.FatKit) {
		component = addon(FatKit);
	}

	if (typeof define == "function" && define.amd) {
		define("fatkit-map", ["fatkit"], function(){
			return component || addon(FatKit);
		});
	}

})(function(UI){

	"use strict";

	UI.component('map', {
		defaults: {
			map_type: "road",
			map_options: {
				draggable: true,
				mapTypeControl: true,
				navigationControl: true,
				overviewMapControl: false,
				panControl: true,
				rotateControl: true,
				scaleControl: true,
				scrollwheel: true,
				streetViewControl: true,
				zoomControl: true
			},
			lat : 0,
			lng : 0,
			zoom : 12,
			marker : false,
			animation: true,
			markers : []
		},

		boot: function() {

			// init code
			UI.ready(function(context) {

				UI.$('[data-f-map]', context).each(function() {

					var objMap = UI.$(this);

					if (!objMap.data("map")) {
						var obj = UI.map(objMap, UI.Utils.options(objMap.attr("data-f-map")));
					}
				});
			});
		},

		init: function() {

			if(typeof google === 'object' && typeof google.maps === 'object')
			{

				// Have Google, go!

				this.SetupMap();

			} else {

				// Create the Google maps script and a callback (ugly, in the global)

				var objScript = document.createElement("script");
				objScript.src = "//maps.google.com/maps/api/js?sensor=false&callback=NoMapLoaded";
				document.body.appendChild(objScript);

			}
		},

		/**
		 * Initialise the map and all the default settings and callbacks for it
		 */
		SetupMap : function()
		{

			// Set the map type

			var strType = google.maps.MapTypeId.ROADMAP;

			switch(this.options.map_type)
			{

				case 'satellite':

					strType = google.maps.MapTypeId.SATELLITE;

					break;

				case 'hybrid':

					strType = google.maps.MapTypeId.HYBRID;

					break;

				case 'terrain':

					strType = google.maps.MapTypeId.TERRAIN;

					break;

			}

			// set map options

			var objOptions	= {
				zoom:		this.options.zoom,
				center:		new google.maps.LatLng(this.options.lat,this.options.lng),
				mapTypeId:	strType
			};

			// Extend the main options with the map options

			UI.$.extend(objOptions, this.options.map_options);

			// create map

			this.objMap		= new google.maps.Map(this.element[0], objOptions);
			this.objBounds	= new google.maps.LatLngBounds();

			if(!!this.options.marker)
			{

				// Set the marker lat and lng to the ones set in the main settings (so we don't repeat)

				this.options.marker.lat = this.options.lat;
				this.options.marker.lng = this.options.lng;

				// add single marker to the map

				this.AddMarker(this.options.marker);

			} else {

				// add apartments to the map

				this.AddMarkers();

			}

		},

		/**
		 * Instantiate Google Street View and set it to visible
		 * @param {Float} strLat The latitude of the place to start
		 * @param {Float} strLng The longitude of the places to start
		 */
		SetupStreetView : function(strLat,strLng)
		{

			this.objStreetView = this.objMap.getStreetView();
			this.objStreetView.setPosition(new google.maps.LatLng(this.options.lat,this.options.lng));
			this.objStreetView.setPov(({
				heading: 34,
				pitch: 10
			}));
			this.objStreetView.setVisible(true);

		},

		/**
		 * Initialise directions stuff
		 */
		SetupDirections : function()
		{

			// Setup the service

			this.objDirections = new google.maps.DirectionsService();

			// And the service renderer

			this.objDirectionsRender = new google.maps.DirectionsRenderer();
			this.objDirectionsRender.setMap(this.objMap);
			this.objDirectionsRender.setPanel(this.objContainer[0]);

		},

		/**
		 * Add a marker point to the map
		 */
		AddMarker : function(objMarker)
		{

			// get point to plot the marker at

			var objPoint = new google.maps.LatLng(objMarker.lat,objMarker.lng);

			// extend map bounds

			this.objBounds.extend(objPoint);

			// create marker

			var marker = new google.maps.Marker({
				position:	objPoint,
				map:		this.objMap,
				title:		objMarker.title,
      			animation:	this.options.animation ? google.maps.Animation.DROP : null
			});

			if(!this.arrMarkers)
			{

				this.arrMarkers = [];

			}

			this.arrMarkers.push(marker);

			var curPos = this.arrMarkers.length - 1;

			// Check for infowindow content and apply it

			if(!!objMarker.infowindow)
			{

				// Reference to the infowindow

				var objThisWindow = objMarker.infowindow;

				// add marker click event

				var objThat = this;

				google.maps.event.addListener(marker, "click", function ()
				{

					var infoWindow = objThat.GetInfoWindow(
						'<div class="f-map-infowindow-title">' + objThisWindow.title + '</div>' +
						'<div class="f-map-infowindow-content">' +
							objThisWindow.content +
						'</div>'
					);

					infoWindow.open(objThat.objMap, marker);

				});

 			}

		},

		/**
		 * Checks that an array of markers is set in the settings and if so appends them one
		 * at a time to the map
		 */
		AddMarkers : function()
		{

			if(!!this.options.markers && this.options.markers.length > 0)
			{

				for(var i=0,intLen=this.options.markers.length;i<intLen;i++)
				{

					this.AddMarker(this.options.markers[i]);

				}

				this.objMap.fitBounds(this.objBounds);

				// Now we need to make sure the map loads inside a hidden container

				var objThat = this;

				google.maps.event.addListenerOnce(this.objMap, "idle", function()
				{

					google.maps.event.trigger(objThat.objMap, 'resize');
					objThat.objMap.fitBounds(objThat.objBounds);

				});

				// And send the complete function

				this.element.trigger('complete.f.map', [this]);

			}

		},

		/**
		 * Reload the map
		 */
		ReloadMap : function()
		{

			google.maps.event.trigger(this.objMap, 'resize');

			this.objMap.setCenter(new google.maps.LatLng(this.options.lat, this.options.lng));

		},

		/**
		 * Re-initialises the Google Street view on the map
		 */
		ReloadStreetView : function()
		{

			google.maps.event.trigger(this.objPano, 'resize');

		},

		/**
		 * Take an address from and an address to and get the directions
		 * body from the Google API
		 * @param {String} strFrom The from address
		 * @param {String} strTo   The to address
		 */
		CalculateDirections : function(strFrom,strTo)
		{

			if(!this.objDirections)
			{

				this.SetupDirections();

			}

			var request = {
				origin: strFrom,
				destination: strTo,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			var objThat = this;

			this.objDirections.route(request, function(response, status)
			{

				if(status === google.maps.DirectionsStatus.OK)
				{

					objThat.objDirectionsRender.setDirections(response);

				}

			});

		},
		
		/**
		 * If an infowindow is set it returns it (as we only want one per map). If not
		 * it creates a new one
		 * @param {String} content The HTML content to put inside the infowindow
		 */
		GetInfoWindow: function(content)
		{
			
			if(!this.objInfoWindow)
			{
				
				this.objInfoWindow = new google.maps.InfoWindow({
					maxWidth:	450
				});
				
			}
			
			this.objInfoWindow.setContent(content);
			
			return this.objInfoWindow;
			
		}
	});
});
window.NoMapLoaded = function()
{

	$("[data-f-map]").data("map").boot();

};