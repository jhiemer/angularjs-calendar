define('app', ['angular', 'routes', 'directives/directives', 'controllers/controllers'], function (angular, routes) {

	var app = angular.module('app', ['directives', 'controllers']);

	app.config(['$routeProvider', function($routeProvider) {
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

	return app;
});
