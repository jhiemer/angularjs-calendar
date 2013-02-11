define([], function () {
	return angular.module('myApp', [		
		'directive.calendar',
		'directive.datePicker',
		'ui.bootstrap.tabs'
	]);
});
