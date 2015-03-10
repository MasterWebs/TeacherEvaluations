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
}]);

angular.module("EvalApp").constant("SERVER_URL", "dispatch.ru.is/h22/api/v1/");

angular.module('EvalApp').controller('LoginController', 
['$scope', '$location', '$rootScope', '$routeParams',
function ($scope, $location, $rootScope, $routeParams) {
	$scope.user = '';
	$scope.pass = '';

	$scope.login = function () {
		// TODO:
		// login user with REST service

	};
}]);

angular.module("LoginResource", function () {
	var currentUser;
	var token;

	return {
		login: function () {  },
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return currentUser; },
		getToken: function () { return token; }
	};
});