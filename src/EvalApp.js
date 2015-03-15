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
			.when('/create-template', {
				templateUrl: 'views/createTemplate.html',
				controller: 'CreateTemplateController'
			})
			.when('/template/:id', {
				templateUrl: 'views/template.html',
				controller: 'TemplateController'
			})
			.when('/course/:id', {
				templateUrl: 'views/courses.html',
				controller: 'CourseController'
			})
			.when('/create-evaluation', {
				templateUrl: 'views/createEvaluation.html',
				controller: 'CreateEvaluation'
			})
			.otherwise({
				redirectTo: '/login'
			});
	}
]);

angular.module("EvalApp").constant("SERVER_URL", "http://dispatch.ru.is/h22/api/v1/");