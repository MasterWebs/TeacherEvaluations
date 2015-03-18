angular.module('EvalApp').controller('LoginController',
['$scope', 'LoginResource', '$location',
function ($scope, LoginResource, $location) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		LoginResource.login($scope.user, $scope.pass)
		.success(function (response) {
			LoginResource.setUser(response.User.Username);
			LoginResource.setToken(response.Token);
			LoginResource.setRole(response.User.Role);
			toastr.success(response.User.Username + ' logged in!');
			if (response.User.Role === 'student') {
				$location.path('/student');
			} else if (response.User.Role === 'admin') {
				$location.path('/admin');
			}
		})
		.error(function () {
			toastr.error('Bad username or password!', 'Login error');
		});
	};
}]);