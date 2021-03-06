	var mapStyle = [
	  {
	    "featureType": "landscape",
	    "stylers": [
	      { "saturation": -53 },
	      { "lightness": 12 },
	      { "hue": "#5eff00" },
	      { "weight": 0.1 },
	      { "visibility": "on" }
	    ]
	  },{
	    "featureType": "poi",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "road",
	    "elementType": "geometry",
	    "stylers": [
	      { "color": "#3c9471" }
	    ]
	  }
	];


	Date.prototype.toSqlString = function() {
		var d1=this;

        var curr_year = d1.getFullYear();

        var curr_month = d1.getMonth() + 1; //Months are zero based
        if (curr_month < 10)
            curr_month = "0" + curr_month;

        var curr_date = d1.getDate();
        if (curr_date < 10)
            curr_date = "0" + curr_date;

        var curr_hour = d1.getHours();
        if (curr_hour < 10)
            curr_hour = "0" + curr_hour;

        var curr_min = d1.getMinutes();
        if (curr_min < 10)
            curr_min = "0" + curr_min;

        var curr_sec = d1.getSeconds();     
        if (curr_sec < 10)
            curr_sec = "0" + curr_sec;

        return curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
	}
	
	var now = new Date();

	var mapHelper = function() {}

	var elm = {};

	['map','from','to','startdate','starttime','addroute'].forEach(function() {
		elm[this] = document.getElementById(this);
	});

	mapHelper.prototype.init = function() {};


	function initialize()
	{

		var addbutton = document.getElementById('addroute');
		var from = document.getElementById('from');
		var to = document.getElementById('to');
		var routes = document.getElementById('routelist');
		var startdate = document.getElementById('startdate');
		var starttime = document.getElementById('starttime');

		var directionsService = new google.maps.DirectionsService();
		

		function mapRoute(from,to) {
  			var dr = new google.maps.DirectionsRenderer();
			dr.setMap(map);
			var request = {
			    origin:from,
			    destination:to,
			    travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
				console.log(response);
				if (status == google.maps.DirectionsStatus.OK) {
			    	dr.setDirections(response);
			    }
			});
			routeDisplays.push(dr);
  		}

		$.getJSON('/api/routes',function(d) {
			for(var i=0;i<d.length;i++)
			{

				var r = d[i];
				var li = document.createElement('li');
				li.innerHTML = '<span>'+r.start+'</span> - <span>'+r.end+'</span>';
				console.log(r);
				mapRoute(r.start,r.end);
				routes.appendChild(li);
			}
		});
		
		function updatePos(lng,lat)
		{
			var latlng = new google.maps.LatLng(lat, lng);
        	map.panTo(latlng);
        	geocoder.geocode({'latLng': latlng}, function(results, status) {
	            if(status == google.maps.GeocoderStatus.OK) {
                	console.log(results[0]);
                	document.getElementById('from').value = results[0]["formatted_address"];
            	};
        	});
		}
		var currentRoute = {};
		
		var styledMap = new google.maps.StyledMapType(mapStyle, {name: "Styled Map"});

		var mapOptions = {
        	center: new google.maps.LatLng(60.604819,15.6656285),
        	mapTypeControlOptions: {
      			mapTypeIds: [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID, 'map_style']
			},
        	zoom: 12
        };
        
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

 		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');
		
  		var routeDisplays = [];

  		

		var directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);

		function calcRoute() {
			currentRoute = {};
			addbutton.className = 'button disabled';
			var start = document.getElementById('from').value;
			var end = document.getElementById('to').value;
			var request = {
			    origin:start,
			    destination:end,
			    travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					addbutton.className = 'button';
					console.log('route',response);
					currentRoute = response.routes[0];
			    	directionsDisplay.setDirections(response);
			    }
			});
		}

		function addRoute()
		{
			
			var l = currentRoute.legs[0];
			if (l) {
				var route = {
					distance: l.distance.value,
					duration: l.duration.value,
					starttime: now.toSqlString(),
					end: l.end_address,
					start: l.start_address,
					startlat: l.start_location.lat(),
					startlng: l.start_location.lng(),
					endlat: l.end_location.lat(),
					endlng: l.end_location.lng(),
				};
				console.log(route);
				$.post('/api/route/add',route,function(d) {
					console.log(d);
				},'json');
			}
		}

		document.getElementById('to').addEventListener('change',calcRoute,false);
		addbutton.addEventListener('click',addRoute,false);

		function getLocation()
		{
			function showPosition(position)
		  	{
		  		updatePos(position.coords.longitude,position.coords.latitude);
		  	}
			if (navigator.geolocation)
		    {
		    	navigator.geolocation.getCurrentPosition(showPosition);
		    }
		}
		getLocation();
		
		
    	var geocoder = new google.maps.Geocoder();
    	if(google.loader.ClientLocation) {
	        var lat = google.loader.ClientLocation.latitude;
        	var lng = google.loader.ClientLocation.longitude;
        	updatePos(lng,lat);
        	
    	}

    	var socket = io.connect('http://samak.foo.com/');


		socket.on('connect', function() {
			socket.emit('adduser', userdata.displayName);
		 	navigator.geolocation.watchPosition(function(position) {
	    		socket.emit('pos', position);
	    	});
		});

		socket.on('updatechat', function (username, data) {
			$('#conversation').append('<div class="msgitem"><div class="msguser"><span class="rating"></span><span class="username">'+username + ':</span></div><div class="bubble">' + data + '</div></div>');
		});

		socket.on('updateusers', function(data) {
			$('#users').empty();
			$.each(data, function(key, value) {
				$('#users').append('<div>' + key + '</div>');
			});
		});

		
		// when the client clicks SEND
		$('#datasend').click( function() {
			var message = $('#data').val();
			$('#data').val('');
			// tell server to execute 'sendchat' and send along one parameter
			socket.emit('sendchat', message);
		});

		// when the client hits ENTER on their keyboard
		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#datasend').focus().click();
			}
		});
		var click = ( 'ontouchstart' in window )?'touchstart':'click';
		
		$('#menubtn').live(click, function(){
			console.log('hoho');
			if( !$('#wrappertwo').hasClass('inactive') ){
				$(this).addClass('close');
				// Slide and scale content
				$('#wrappertwo').addClass('inactive');
				setTimeout(function(){ $('#wrappertwo').addClass('flag'); }, 100);
				
				// Slide in menu links
				var timer = 0;
				$.each($('#menutwo li'), function(i,v){
					timer = 40 * i;
					setTimeout(function(){
						$(v).addClass('visible');
					}, timer);
				});
			}
		});
			
			

			/*	Close Menu */
		function closeMenu() {		
			// Slide and scale content
			$('#wrappertwo').removeClass('inactive flag');
			$('#menubtn').removeClass('close');
			// Reset menu
			setTimeout(function(){
				$('#menutwo li').removeClass('visible');
			}, 300);
		}
			
		$('#wrappertwo').live(click, function(e){
			e.stopPropagation();
			e.preventDefault();
			if( $('#wrappertwo').hasClass('flag') ){
				closeMenu();
			}
		});
		$('#menutwo li a').live(click, function(e){
			e.preventDefault();
			$('.view').removeClass('show');
			var view = $(this).attr('data-view');
			$('.'+view).addClass('show');
			closeMenu();
		});
		$('#msglist li').click(function() {
			$('.view').removeClass('show');
			$('.msgprofile').addClass('show');
		});
		$('.showmap').click(function() {
			$('body').toggleClass('showmap');
		});

	}
	google.load("jquery", "1.4.2");
	google.load("maps", "3.x", {other_params: "sensor=false", callback:initialize});
	document.getElementById('userdata').innerHTML = userdata.displayName;
	document.getElementById('profilepic').src = 'https://graph.facebook.com/'+userdata.username+'/picture';


	