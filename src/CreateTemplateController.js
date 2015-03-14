angular.module('EvalApp').controller('CreateTemplateController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.token = LoginResource.getToken();
	$scope.role = LoginResource.getRole();
	$scope.title = '';
	$scope.titleEN = '';
	$scope.intro = '';
	$scope.introEN = '';
	$scope.courseQuestions = [];
	$scope.teacherQuestions = [];
	$scope.qText = '';
	$scope.qTextEN = '';
	$scope.qImageURL = '';
	$scope.qType = 'Text';
	$scope.qTeacher = false; //boolean to decide if it is a course and/or a teacher question

	if ($scope.role !== 'admin') {
		$location.path('/login');
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
			toastr.error("You need to add a question first");
		} else {
			EvaluationTemplateResource.init($scope.token);
			var templateObj = {
				ID: 0,
				Title: $scope.title,
				TitleEN: $scope.titleEN,
				IntroText: $scope.intro,
				IntroTextEN: $scope.introEN,
				CourseQuestions: $scope.courseQuestions,
				TeacherQuestions: $scope.teacherQuestions
			};
	
			EvaluationTemplateResource.create(templateObj)
			.success (function (response) {
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
			var qObj = {};
			if($scope.qType === 'Single' || $scope.qType === 'Multiple') {//add answers array
				console.log('single | multi');
				qObj = {
					ID: 0,
					Text: $scope.qText,
					TextEN: $scope.qTextEN,
					ImageURL: $scope.qImageURL,
					Type: $scope.qType, //single, multiple
					Answers: []
				};
			} else {  // qType = text, no answer array
				console.log('Text');
				qObj = {
					ID: $scope.qID,
					Text: $scope.qText,
					TextEN: $scope.qTextEN,
					ImageURL: $scope.qImageURL,
					Type: $scope.qType
				};
			}
	
			if($scope.qTeacher === false) {
				$scope.courseQuestions.push(qObj);
				$scope.teacherQuestions.push(qObj);
				toastr.success("Added question related to course and teachers");
			} else {
				$scope.teacherQuestions.push(qObj);
				toastr.success("Added question related to teachers");
			}
		}
	};
}]);