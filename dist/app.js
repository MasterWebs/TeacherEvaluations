angular.module('EvalApp', ['ngRoute']).config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginController'
			})
			.when('/student', {
				templateUrl: 'views/studentFrontpage.html',
				controller: 'StudentController'
			})
			.when('/admin', {
				templateUrl: 'views/adminFrontpage.html',
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
		init: function (_token) {
			token = 'Basic ' + _token;
			config = {headers:{'Authorization': token}};
		},
		courses: function () { return $http.get(SERVER_URL + 'my/courses', config); },
		evaluations: function () { return $http.get(SERVER_URL + 'my/evaluations', config); }		

	};
}]);

angular.module('EvalApp').controller('StudentController',
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
	$scope.myCourses = [];
	$scope.myEvaluations = [];
	
	if(token !== undefined) {
		MyResource.init(token);  //Initialize token and config in MyResource
		
		MyResource.courses()
		.success(function (response) {
			$scope.myCourses = response;
			console.log("Courses: " + $scope.myCourses);
			toastr.success("Fetched courses");

		})
		.error(function () {
			toastr.error("Something went wrong");
		});

		MyResource.evaluations()
		.success (function (response) {
			$scope.myEvaluations = response;
			console.log("Eval: " + $scope.myEvaluations);
			toastr.success("Fetched evaluations");
		})
		.error (function () {
			toastr.error("Could not fetch your evaluations");
		});
	} else {
		toastr.error("Token undefined");
	}
}]);