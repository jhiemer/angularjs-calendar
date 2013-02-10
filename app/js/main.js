(function () {
	require.config({
		paths:{
			underscore:'../libs/underscore/underscore',
			angular:'../libs/angular/angular',
			angularResource:'../libs/angular/angular-resource.min',
			angularCookies:'../libs/angular/angular-cookies.min',
			text:'../libs/require/text',
			moment:'../libs/moment/moment.min',
			jquery:'../libs/jquery/jquery-1.8.2.min',
			bootstrap:'../libs/bootstrap/bootstrap.min'
		},
		shim:{
			'angular':{'exports':'angular'},
			'angularResource':{exports:'angularResource', deps:['angular']},
			'underscore':{exports:'_'},
			'angularCookies':{exports:'angularCookies', deps:['angular']},
			'bootstrap':{exports:'bootstrap', deps:['jquery']}
		}
	});

	function tryHoldReady() {
		if (!tryHoldReady.executed && window.jQuery) {
			window.jQuery.holdReady(true);
			tryHoldReady.executed = true;
		}
	}

	tryHoldReady();
	require.onResourceLoad = tryHoldReady;

	require([
		'jquery',
		'bootstrap',
		'angular',
		'angularResource',
		'angularCookies',
		'app'
	], function (jQuery) {
		jQuery.holdReady(false);
		angular.bootstrap(document, ['app']);
	});
})();