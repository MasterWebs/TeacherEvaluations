angular.module('EvalApp').controller('LoginController', 
['$scope', '$location', '$rootScope', '$routeParams', 'LoginResource',
function ($scope, $location, $rootScope, $routeParams, LoginResource) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service
		if ($scope.user !== '' && $scope.pass !== '') {
			LoginResource.login($scope.user, $scope.pass);
		} else {
			if ($scope.user === '' && $scope.pass === '') {
				toastr.error('Username and password cannot be empty!', 'Login error');
			} else if ($scope.user === '') {
				toastr.error('Username cannot be empty!', 'Login error');
			} else {
				toastr.error('Password cannot be empty!', 'Login error');
			}
		}
	};
}]);