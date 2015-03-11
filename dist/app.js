angular.module('EvalApp', ['ngRoute']).config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginController'
			})
			.otherwise({
				redirectTo: '/login'
			});
	}
]);

angular.module("EvalApp").constant("SERVER_URL", "http://dispatch.ru.is/h22/api/v1/");

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

angular.module("EvalApp").factory("LoginResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var user;
	var token;
	var role;

	return {
		login: function (user, pass) {
			var loginObj = {
				user: user,
				pass: pass
			};
			console.log('loginObj: ' + JSON.stringify(loginObj));
			$http.post(SERVER_URL + 'login', loginObj)
			.success(function (response) {
				token = response.Token;
				user = response.Username;
				role = response.Role;
				return 1;  // return success code (1)
			})
			.error(function () {
				console.log('login unsuccessful');
				return -1; // return error code (-1)
			});
		},
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return user; },
		getToken: function ()    { return token; },
		getRole: function ()     { return role; }
	};
}]);