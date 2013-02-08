define(['app'], function (app) {
	'use strict';

	return app.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider) {		
		$routeProvider.
		when('/components/calendar', {
			templateUrl: 'partials/components/calendar.html',
			controller: 'CalendarController'
		}).
		when('/components/date-picker', {
			templateUrl: 'partials/components/date-picker.html',
			controller: 'CalendarController'
		}).
		when('/components/event', {
			templateUrl: 'partials/components/event.html',
			controller: 'CalendarController'
		}).
		otherwise({redirectTo:'/'}); 	
	}]);
});
