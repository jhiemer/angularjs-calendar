/**
 * The current calendar controller
 **/

define(['app'], function (app) {
	'use strict';
	
	return app.controller('CalendarController', ['$scope', 'eventService',
		function CalendarController($scope, eventService) {			
			console.log('------------------------------------------------------');
			console.log('-----------new run through the program----------------');
			console.log('------------------------------------------------------');
			$scope.events = [];
			$scope.times = [];
			$scope.date = moment().add('days', 0);

			$scope.initForm = function() {
				for (var i = 0; i < 96; i++) {
					var date = moment().sod().add('minutes', i*15);
					$scope.times.push(date);
				}				
			};

			$scope.addAttendee = function() {
				$scope.calendar = $scope.calendar || {};
				$scope.calendar.attendees = $scope.calendar.attendees || [];
				$scope.calendar.attendees.push({
					"id": "3m32ic0",
					"email": $scope.calendar.attendee,
					"displayName": "John",
					"organizer": true,
					"self": false,
					"resource": false,
					"optional": true,
					"responseStatus": "none",
					"comment": "none",
					"additionalGuests": 0
				});
				$scope.calendar.attendee = '';
				console.log('add attendee was clicked');
			};
	
			$scope.removeAttendee = function(attendee) {
				var index = $scope.calendar.attendees.indexOf(attendee);
				$scope.calendar.attendees.splice(index, 1);  
				console.log('remove attendee was clicked');
			};
	 
			$scope.addEvent = function() {
				console.log('add event was clicked');
			}; 
	
			var colorArray = ['blue', 'lilac', 'turqoise', 'green', 'bold-green', 'yellow',
				'orange', 'red', 'bold-red', 'purple', 'grey'];
		
			var createEvents = function(date) {
			var   d = date.getDate(),
						m = date.getMonth(),
						y = date.getFullYear(),
						max = colorArray.length - 1,
						min = 0,
						color;
			var randColor = function() {
				return colorArray[Math.floor(Math.random() * (max - min + 1)) + min];
			};
 
			var ids = 11413,
					s, e;
			var id = function id() { 
				return ++ids; 
			};

			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < 4; j++) {
					var temporaryEvent = {
						"id"          : id(),
						"start"       : s = moment().add('days', -i*j),
						"end"         : e = moment().add('days', j),
						"colorId"     : randColor(),
						"summary"     : "Event (" + (i*j+j+1) + " Days) Start: " + s.format('DD.MM') + " End: " + e.format('DD.MM'),
						"description" : "Start: " + s + " End: " + e 
					};
					$scope.events.push(temporaryEvent);
				}
			}
		    
		  	for (var i = -2; i < 2; i++) {
		  		for (var j = 0; j < 4; j++) {
		      		var rand = Math.floor(Math.random()*10)+1;
					var inDayEvent = {
						"id"          : id(),
						"start"       : s = moment().add('days', i).sod().add('hours', rand),
						"end"         : e = moment().add('days', i).sod().add('hours', j + rand),
						"colorId"     : randColor(),
						"summary"     : "Event (" + (i*j+j+1) + " Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
		  			"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
					};
					$scope.events.push(inDayEvent);
				}
			}

			var fiveDayEvent = {
				"id"          : id(),
				"start"       : s = moment().add('days', -2),
				"end"         : e = moment().add('days', 3),
				"colorId"     : randColor(),					
				"summary"     : "Event (5 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
	  		"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};
			$scope.events.push(fiveDayEvent);

			var threeDayEvent = {
				"id"          : id(),
				"start"       : s = moment().add('days', -1),
				"end"         : e = moment().add('days', 2),
				"colorId"     : randColor(),
				"summary"     : "Event (3 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
	  		"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};
			$scope.events.push(threeDayEvent);
	
			var currentWholeDayEvent = {
				"id"          : id(),
				"start"       : s = moment().sod(),
				"end"         : e = moment().eod(),
				"colorId"     : randColor(),
				"summary"     : "Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
	  		"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			}; 
			$scope.events.push(currentWholeDayEvent);
		
			var inDayEvent = {
				"id"          : id(),
				"start"       : s = moment().add('hours', -4),
				"end"         : e = moment().add('hours', 2),
				"colorId"     : randColor(),
				"summary"     : "Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
	  		"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};
			$scope.events.push(inDayEvent);
	
			var shortInDayEvent = {
				"id"          : id(),
				"start"       : s = moment().add('hours', -1),
				"end"         : e = moment().add('hours', 1),
				"colorId"     : randColor(),
				"summary"     : "Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
	  		"description" : "Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};
			$scope.events.push(shortInDayEvent);  

		};
		createEvents(new Date());
			 
		eventService.appendEvents($scope.events);
	}]);
});