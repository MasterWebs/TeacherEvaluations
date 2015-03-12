angular.module('EvalApp').controller('CreateTemplateController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.title = '';
	$scope.titleEN = '';
	$scope.intro = '';
	$scope.introEN = '';
	$scope.courseQuestions = [];
	$scope.teacherQuestions = [];
	$scope.qText = '';
	$scope.qTextEN = '';
	$scope.qImageURL = '';
	$scope.qType = '';
	$scope.q = true; //boolean to decide if it is a course or a teacher question
	$scope.tID = 0;
	$scope.qID = 0;

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
			var templateObj = {
				ID: $scope.tID,
				Title: $scope.title,
				TitleEN: $scope.titleEN,
				IntroText: $scope.intro,
				IntroTextEN: $scope.introEN,
				CourseQuestions: $scope.courseQuestions,
				TeacherQuestions: $scope.teacherQuestions
			};
			console.log(templateObj);
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
				Type: 'Single', //text, single, multiple
				Answers: {
					ID: 0,
					Text: '',
					TextEN: '',
          			ImageURL: '',
          			Weight: 0
				}

			};
			$scope.qID++;
			if($scope.q === true) {
				$scope.courseQuestions.push(qObj);
				$scope.teacherQuestions.push(qObj);
			} else {
				$scope.teacherQuestions.push(qObj);
			}
		}
	};
}]);