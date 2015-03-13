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
			.otherwise({
				redirectTo: '/login'
			});
	}
]);

angular.module("EvalApp").constant("SERVER_URL", "http://dispatch.ru.is/h22/api/v1/");

angular.module('EvalApp').controller('AdminController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.token = LoginResource.getToken();
	$scope.evaluationTemplates = [];

	EvaluationTemplateResource.init($scope.token);

	EvaluationTemplateResource.getTemplates()
	.success(function (response) {
		toastr.success("Fetched all templates");
		$scope.evaluationTemplates = response;
	})
	.error(function () {
		toastr.error("Could not fetch all evaluation templates");
	});

	$scope.redirect = function (route) {
		if (route === 'create') {
			$location.path('/create-template');
		}
	};


}]);

angular.module('EvalApp').controller('CreateTemplateController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.token = LoginResource.getToken();
	$scope.title = '';
	$scope.titleEN = '';
	$scope.intro = '';
	$scope.introEN = '';
	$scope.courseQuestions = [];
	$scope.teacherQuestions = [];
	$scope.qText = '';
	$scope.qTextEN = '';
	$scope.qImageURL = '';
	$scope.qType = 'Single';
	$scope.qTeacher = false; //boolean to decide if it is a course or a teacher question
	$scope.tID = 0;
	$scope.qID = 0;

	if ($scope.token === undefined) {
		toastr.error("YOU SHALL NOT PASS");
	}
	$scope.createTemplate = function () {

		if ($scope.title === '') { 
			toastr.error("Title cannot be empty"); 
		} else if ($scope.titleEN === '') {
		 toastr.error("Title in english cannot be empty"); 
		} else if ($scope.intro === '') {
			toastr.error("Intro cannot be empty");
		} else if ($scope.introEN === '') {
			toastr.error("Intro in english cannot be empty");
		} else if ($scope.teacherQuestions.length === 0) {
			toastr.error("Teacher questions are empty");
		} else {
			EvaluationTemplateResource.init($scope.token);
			var templateObj = {
				ID: $scope.tID,
				Title: $scope.title,
				TitleEN: $scope.titleEN,
				IntroText: $scope.intro,
				IntroTextEN: $scope.introEN,
				CourseQuestions: $scope.courseQuestions,
				TeacherQuestions: $scope.teacherQuestions
			};
	
			EvaluationTemplateResource.create(templateObj)
			.success (function (response) {
				$scope.tID++;
				toastr.success("Created evaluation template");
			})
			.error (function () {
				toastr.error("Could not create template");
			});
		}
	};

	$scope.createQuestion = function () {
		if ($scope.qText === '') {
			toastr.error("Question text cannot be empty");
		} else if ($scope.qTextEN === '') {
			toastr.error("Questin text in english cannot be empty");
		} else {
			var qObj = {
				ID: $scope.qID,
				Text: $scope.qText,
				TextEN: $scope.qTextEN,
				ImageURL: $scope.qImageURL,
				Type: $scope.qType, //text, single, multiple
				Answers: {
					ID: 0,
					Text: '',
					TextEN: '',
          			ImageURL: '',
          			Weight: 0
				}

			};
			console.log("type: " + qObj.Type);
			$scope.qID++;
			if($scope.qTeacher === false) {
				$scope.courseQuestions.push(qObj);
				$scope.teacherQuestions.push(qObj);
			} else {
				$scope.teacherQuestions.push(qObj);
			}
		}
	};
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



angular.module('EvalApp').factory('EvaluationTemplateResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';

	return {
		init: function (_token) {	//initializes the config
			var token = 'Basic ' + _token; 
			config = {headers: {'Authorization': token}};
		},
		getTemplates: function () {	// returns a list of all evaluation templates
			return $http.get(SERVER_URL + 'evaluationtemplates', config);
		},
		getTemplate: function (id) {	//returns specific evaluation template

		},
		create: function (template) {	//creates a new evaluation template
			return $http.post(SERVER_URL + 'evaluationtemplates', template, config);
		}

	};
}]);

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
				console.log(response.User.Role);
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
		// logout: function () {  },
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
	var config = '';
	
	return {
		init: function (_token) {
			var token = 'Basic ' + _token;
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
	$scope.currentUser = LoginResource.getUser();
	$scope.myCourses = [];
	$scope.myEvaluations = [];
	
	if(token !== undefined) {
		MyResource.init(token);  //Initialize token and config in MyResource
		
		MyResource.courses()
		.success(function (response) {
			$scope.myCourses = response;
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