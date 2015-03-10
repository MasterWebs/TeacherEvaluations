angular.module('Evaluations', ['ngRoute']).config(['$routeProvider',
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