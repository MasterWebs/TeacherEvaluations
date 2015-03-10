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

angular.module("EvalApp").factory("LoginResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var currentUser;
	var token;

	return {
		login: function (user, pass) {
			var loginObj = {
				user: user,
				pass: pass
			};
			console.log('loginObj' + loginObj);
			$http.post(SERVER_URL + 'login', loginObj)
			.success(function (response) {
				console.log('login success, data:' + response);
			})
			.error(function () {
				console.log('login unsuccessful');
			});
		},
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return currentUser; },
		getToken: function () { return token; }
	};
}]);