define(function () {
	'use strict';

	function ChildControllerFactory($scope) {

		$scope.initDialog = function () {
			//TODO was macht das?
			if ($scope.$parent.$parent.todo) {
				$scope.todo = $scope.$parent.$parent.todo;
			} else {
				$scope.todo = {};
			}
			$scope.$parent.$parent.todo = $scope.todo;
		};
	}

	ChildControllerFactory.$injet = ['$scope'];

	return ChildControllerFactory;

});