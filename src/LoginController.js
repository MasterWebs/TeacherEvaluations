angular.module('Evaluations').controller('LoginController', 
['$scope', '$location', '$rootScope', '$routeParams',
function ($scope, $location, $rootScope, $routeParams) {
	$scope.nickname = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service
	}
}]);