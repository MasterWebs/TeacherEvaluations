angular.module('EvalApp', ['ngRoute']).config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginController'
			})
			.when('/home', {
				templateUrl: 'views/home.html',
				controller: 'HomeController'
			})
			.otherwise({
				redirectTo: '/login'
			});
	}
]);

angular.module("EvalApp").constant("SERVER_URL", "http://dispatch.ru.is/h22/api/v1/");

angular.module('EvalApp').controller('HomeController',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
	var courses = [];

	
	if(token !== undefined) {
		console.log(token);

		MyResource.courses(token)
		.success(function (response) {
			toastr.success("Fetched courses");

		})
		.error(function () {
			toastr.error("Something went wrong");
		});
	} else {
		toastr.error("Token undefined");
	}
});

angular.module('EvalApp').controller('LoginController',
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
});

angular.module("EvalApp").factory("LoginResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var user = '';
	var token = '';
	var role = '';

	return {
		login: function (user, pass) {
			var loginObj = {
				user: user,
				pass: pass
			};
			return $http.post(SERVER_URL + 'login', loginObj);
		},
		logout: function () {  },
		isLoggedIn: function () {
			if(user !== ''){
				return true;	
			} 
			return false;
		},
		getUser: function () { return user; },
		getToken: function ()    { return token; },
		getRole: function ()     { return role; },
		setUser: function (_user) { user = _user; },
		setToken: function (_token) { token = _token; },
		setRole: function (_role) { role = _role; }
	};
}]);

angular.module("EvalApp").factory("MyResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {

	return {
		courses: function (token) { return $http.get(SERVER_URL + 'my/courses', token); }		

	};
}]);