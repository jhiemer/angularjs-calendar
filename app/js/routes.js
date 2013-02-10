define(function () {
	'use strict';

	function RouteFactory($routeProvider) {
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
	}

	RouteFactory.$inject = '$routeProvider';

	return RouteFactory;
});
