//define(['angular', 'controllers/homeController', 'controllers/components/calendarController', 'controllers/components/childController'],
define(['angular', 'controllers/components/calendarController'],
	function(angular, CalendarController) {

		var controllers = angular.module("controllers", []);

//		controllers.controller("homeController", HomeController);
		controllers.controller("calendarController", CalendarController);
//		controllers.controller("childController", ChildController);

		return controllers;

});
