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
	$scope.qTypeOption = [ {opt: 'text'}, {opt: 'single'}, {opt: 'multiple'} ];
	$scope.qType = $scope.qTypeOption[0];
	$scope.optionRelate = [ {to:'Courses'}, {to:'Teachers'}, {to:'Course & Teachers'} ];
	$scope.relate = $scope.optionRelate[0];
	$scope.answers = [{
		Text: '',
		TextEN: '',
		ImageURL: '',
		Weight: 1
	}];


	if ($scope.role !== 'admin') {
		$location.path('/login');
	}

	$scope.createTemplate = function () {
		if ($scope.teacherQuestions.length === 0 || $scope.courseQuestions.length === 0) {
			toastr.error("You need to add at least one question ");
		} else {
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
			.success (function () {
				toastr.success("Created evaluation template");
			})
			.error (function () {
				toastr.error("Could not create template");
			});
		}
	};

	$scope.createQuestion = function () {
		var qObj = {};

		if($scope.qType.opt === 'single' || $scope.qType.opt === 'multiple') {//add answers array
			qObj = {
				ID: 0,
				Text: $scope.qText,
				TextEN: $scope.qTextEN,
				ImageURL: $scope.qImageURL,
				Type: $scope.qType.opt, //single, multiple
				Answers: $scope.answers
			};
		} else {  // qType = text, no answer array
			qObj = {
				ID: $scope.qID,
				Text: $scope.qText,
				TextEN: $scope.qTextEN,
				ImageURL: $scope.qImageURL,
				Type: $scope.qType.opt
			};
		}
		
		if($scope.relate.to === 'Courses') {	
			$scope.courseQuestions.push(qObj);
			toastr.success("Added question to Courses");
		} else if ($scope.relate.to === 'Teachers') {
			$scope.teacherQuestions.push(qObj);
			toastr.success("Added question to teachers");
		} else { //Course and teachers
			$scope.courseQuestions.push(qObj);
			$scope.teacherQuestions.push(qObj);
			toastr.success("Added question to courses and teachers");
		}
	};

	$scope.addAnswer = function (option) {
		if(option === 'add') {
			var ans = {
				Text: '',
				TextEN: '',
				ImageURL: '',
				Weight: 1
			};
			$scope.answers.push(ans);
		} else if (option === 'delete') {
			$scope.answers.pop();
		} 
	};
}]);