define(['app'], function (app) {
	'use strict';
	
	return app.controller('ChildController', ['$scope', '$http',
		function ChildController($scope, $http) {
			$scope.initDialog = function () {
				if ($scope.$parent.$parent.todo !== undefined) {
					$scope.todo = $scope.$parent.$parent.todo;
				} else {
					$scope.todo = {};
				}
				$scope.$parent.$parent.todo = $scope.todo;
			};
	}]);
});