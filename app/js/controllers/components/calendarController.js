define(['moment'], function (moment) {
	'use strict';

	function CalendarControllerFactory($scope, eventService) {
		console.log('------------------------------------------------------');
		console.log('-----------new run through the program----------------');
		console.log('------------------------------------------------------');

		$scope.test = "TestTest";
		$scope.events = [];
		$scope.times = [];
		$scope.date = moment().add('days', 0);

		$scope.initForm = function () {
			var i, date;
			for (i = 0; i < 96; i++) {
				date = moment().sod().add('minutes', i * 15);
				$scope.times.push(date);
			}
		};

		$scope.addAttendee = function () {
			$scope.calendar = $scope.calendar || {};
			$scope.calendar.attendees = $scope.calendar.attendees || [];
			$scope.calendar.attendees.push({
				"id":"3m32ic0",
				"email":$scope.calendar.attendee,
				"displayName":"John",
				"organizer":true,
				"self":false,
				"resource":false,
				"optional":true,
				"responseStatus":"none",
				"comment":"none",
				"additionalGuests":0
			});
			$scope.calendar.attendee = '';
			console.log('add attendee was clicked');
		};

		$scope.removeAttendee = function (attendee) {
			var index = $scope.calendar.attendees.indexOf(attendee);
			$scope.calendar.attendees.splice(index, 1);
			console.log('remove attendee was clicked');
		};

		$scope.addEvent = function () {
			console.log('add event was clicked');
		};

		var colorArray = ['blue', 'lilac', 'turqoise', 'green', 'bold-green', 'yellow',
			'orange', 'red', 'bold-red', 'purple', 'grey'];

		function createEvents() {
			var max, min, s, e, i, j, ids, id,
				randColor, temporaryEvent, rand, fiveDayEvent, threeDayEvent, currentWholeDayEvent, inDayEvent, shortInDayEvent;

			max = colorArray.length - 1;
			min = 0;

			randColor = function () {
				return colorArray[Math.floor(Math.random() * (max - min + 1)) + min];
			};

			ids = 11413;

			id = function id() {
				return ++ids;
			};

			for (i = 0; i < 2; i++) {
				for (j = 0; j < 4; j++) {
					temporaryEvent = {
						"id":id(),
						"start":s = moment().add('days', -i * j),
						"end":e = moment().add('days', j),
						"colorId":randColor(),
						"summary":"Event (" + (i * j + j + 1) + " Days) Start: " + s.format('DD.MM') + " End: " + e.format('DD.MM'),
						"description":"Start: " + s + " End: " + e
					};
					$scope.events.push(temporaryEvent);
				}
			}

			for (i = -2; i < 2; i++) {
				for (j = 0; j < 4; j++) {
					rand = Math.floor(Math.random() * 10) + 1;
					inDayEvent = {
						"id":id(),
						"start":s = moment().add('days', i).sod().add('hours', rand),
						"end":e = moment().add('days', i).sod().add('hours', j + rand),
						"colorId":randColor(),
						"summary":"Event (" + (i * j + j + 1) + " Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
						"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
					};
					$scope.events.push(inDayEvent);
				}
			}

			fiveDayEvent = {
				"id":id(),
				"start":s = moment().add('days', -2),
				"end":e = moment().add('days', 3),
				"colorId":randColor(),
				"summary":"Event (5 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
				"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};

			threeDayEvent = {
				"id":id(),
				"start":s = moment().add('days', -1),
				"end":e = moment().add('days', 2),
				"colorId":randColor(),
				"summary":"Event (3 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
				"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};

			currentWholeDayEvent = {
				"id":id(),
				"start":s = moment().sod(),
				"end":e = moment().eod(),
				"colorId":randColor(),
				"summary":"Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
				"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};

			inDayEvent = {
				"id":id(),
				"start":s = moment().add('hours', -4),
				"end":e = moment().add('hours', 2),
				"colorId":randColor(),
				"summary":"Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
				"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};

			shortInDayEvent = {
				"id":id(),
				"start":s = moment().add('hours', -1),
				"end":e = moment().add('hours', 1),
				"colorId":randColor(),
				"summary":"Event (1 Days) Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM'),
				"description":"Start: " + s.format('DD.MM-HH:MM') + " End: " + e.format('DD.MM-HH:MM')
			};

			$scope.events.push(inDayEvent);
			$scope.events.push(fiveDayEvent);
			$scope.events.push(threeDayEvent);
			$scope.events.push(currentWholeDayEvent);
			$scope.events.push(shortInDayEvent);
		}

		createEvents();

		eventService.appendEvents($scope.events);
	}

	CalendarControllerFactory.$inject = ['$scope', 'eventService'];

	return CalendarControllerFactory;

});