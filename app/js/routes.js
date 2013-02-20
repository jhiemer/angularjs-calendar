define(['app'], function (app) {
	'use strict';

	return app.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider) {		
		$routeProvider.
		when('/', {
			templateUrl: 'partials/components/calendar.html',
			controller: 'CalendarController'
		}).
		otherwise({redirectTo:'/'}); 	
	}]);
});
