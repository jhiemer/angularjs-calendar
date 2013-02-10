define(function () {
	'use strict';
	//TODO - wofür gibts diesen Controller?
	function HomeControllerFactory($scope, $http) {
		console.log($scope, $http);
	}

	HomeControllerFactory.$inject = ['$scope', '$http'];

	return HomeControllerFactory;
});