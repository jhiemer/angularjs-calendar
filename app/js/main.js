require.config({
	paths: {		   
		underscore: '../libs/underscore/underscore',
		angular: '../libs/angular/angular.min',
		angularResource: '../libs/angular/angular-resource.min',
		angularCookies: '../libs/angular/angular-cookies.min',
		text: '../libs/require/text',
		moment: '../libs/moment/moment.min'
    },
	shim: {
		'angular' : {'exports' : 'angular'},
		'angular-resource' : {deps:['angular']},
		'underscore': {exports: '_'}
	},
	priority: [
		"angular"
	],
	urlArgs: 'v=0.1'
});

require([			
	'angular', 		
	'angularResource',
	'angularCookies',
	'moment',
	'app',
	'routes',
	'directives/calendarDirective',
	'directives/calendarDatePickerDirective',
	'directives/angular-ui/tabs',
	'controllers/homeController',			
	'controllers/components/calendarController'
], function(angular, app) {
  angular.element(document).ready(function () {
    angular.bootstrap(document, ['myApp']);
  });
});
