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
function ($scope, LoginResource) {
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
			})
			.error(function () {
				toastr.error('Bad username or password!', 'Login error');
			});
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
			return $http.post(SERVER_URL + 'login', loginObj);
		},
		logout: function () {  },
		isLoggedIn: function () {  },
		getUser: function () { return user; },
		getToken: function ()    { return token; },
		getRole: function ()     { return role; },
		setUser: function (_user) { user = _user; },
		setToken: function (_token) { token = _token; },
		setRole: function (_role) { role = _role; }
	};
}]);