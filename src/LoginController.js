angular.module('EvalApp').controller('LoginController', 
['$scope', '$location', '$rootScope', '$routeParams',
function ($scope, $location, $rootScope, $routeParams) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service

	};
}]);