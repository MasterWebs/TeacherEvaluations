angular.module('EvalApp').controller('LoginController',
function ($scope, LoginResource, toastr) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service
		if ($scope.user !== '' && $scope.pass !== '') {
			var result = LoginResource.login($scope.user, $scope.pass);
			if (result > 0) {
				// success
				toastr.success(LoginResource.user + ' logged in!');
			} else {
				// error
				toastr.error('Could not be logged in!', 'Login error');
			}
		} else {
			toastr.error('Username or password empty!', 'Login error');
		}
	};
});