angular.module('EvalApp').controller('LoginController',
['$scope', 'LoginResource', '$location',
function ($scope, LoginResource, $location) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service
		if ($scope.user !== '' && $scope.pass !== '') {
			LoginResource.login($scope.user, $scope.pass)
			.success(function (response) {
				LoginResource.setUser(response.User.Username);
				LoginResource.setToken(response.Token);
				LoginResource.setRole(response.User.Role);
				toastr.success(response.User.Username + ' logged in!');
				$location.path('/home/');
			})
			.error(function () {
				toastr.error('Bad username or password!', 'Login error');
			});
		} else {
			toastr.error('Username or password empty!', 'Login error');
		}
	};
}]);