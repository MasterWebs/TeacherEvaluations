angular.module('EvalApp', ['ngRoute']).config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginController'
			})
			.when('/student', {
				templateUrl: 'views/student-frontpage.html',
				controller: 'StudentController'
			})
			.when('/admin', {
				templateUrl: 'views/admin-frontpage.html',
				controller: 'AdminController'
			})
			.otherwise({
				redirectTo: '/login'
			});
	}
]);

angular.module("EvalApp").constant("SERVER_URL", "http://dispatch.ru.is/h22/api/v1/");

angular.module('EvalApp').controller('AdminController', 
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
}]);

angular.module('EvalApp').directive('evaluationQuestion',
function () {
	return {
		restrict: 'E',
		scope: {
			question: 'ngModel'
		},
		templateUrl: 'views/evaluationQuestion.tpl.html',
		link: function (scope, element, attributes) {

		}
	};
});

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
				// console.log(JSON.stringify(response));
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
		} else {
			toastr.error('Username or password empty!', 'Login error');
		}
	};
}]);

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
	var token = '';
	var config = '';
	return {
		courses: function (tok) { 
			token = 'Basic ' + tok;
			config = {headers:{'Authorization': token}};
			return $http.get(SERVER_URL + 'my/courses', config); }		

	};
}]);

angular.module('EvalApp').controller('StudentController',
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
	$scope.courses = [];

	
	if(token !== undefined) {
		console.log(token);

		MyResource.courses(token)
		.success(function (response) {
			console.log(response);
			$scope.courses = response;
			toastr.success("Fetched courses");

		})
		.error(function () {
			toastr.error("Something went wrong");
		});
	} else {
		toastr.error("Token undefined");
	}
}]);