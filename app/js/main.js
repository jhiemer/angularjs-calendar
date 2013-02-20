require.config({
	paths: {		   
		angular: '../libs/angular/angular.min',
		moment: '../libs/moment/moment.min'
    },
	shim: {
		'angular' : {'exports' : 'angular'},
	},
	priority: [
		"angular"
	],
	urlArgs: 'v=0.1'
});

require([			
	'angular', 		
	'moment',
	'app',
	'routes',
	'directives/calendar',
	'directives/angular-ui/tabs',
	'controllers/components/calendarController'
], function(angular, app) {
  angular.element(document).ready(function () {
    angular.bootstrap(document, ['myApp']);
  });
});
