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
	$scope.qTypeOption = [ {opt: 'Text'}, {opt: 'Single'}, {opt: 'Multiple'} ];
	$scope.qType = $scope.qTypeOption[0];
	$scope.optionRelate = [ {to:'Courses'}, {to:'Teachers'}, {to:'Course & Teachers'} ];
	$scope.relate = $scope.optionRelate[0];
	$scope.answers = [ {answer: ''} ];

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
		} else if ($scope.teacherQuestions.length === 0 && $scope.courseQuestions.length === 0) {
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
			var cont = true; //should create queastion if answers are filled
			if($scope.qType.opt === 'Single' || $scope.qType.opt === 'Multiple') {//add answers array
				for(var i = 0; i < $scope.answers.length; i++) {  //checks if an answer field is empty
					if($scope.answers[i].answer === '') {
						toastr.error("Answer field cannot be empty");
						cont = false;
					}
				}

				if(cont) {  // should not create question if one answer field is empty
					
					qObj = {
						ID: 0,
						Text: $scope.qText,
						TextEN: $scope.qTextEN,
						ImageURL: $scope.qImageURL,
						Type: $scope.qType.opt, //single, multiple
						Answers: $scope.answers
					};
				}
			} else {  // qType = text, no answer array
				console.log('Text');
				qObj = {
					ID: $scope.qID,
					Text: $scope.qText,
					TextEN: $scope.qTextEN,
					ImageURL: $scope.qImageURL,
					Type: $scope.qType.opt
				};
			}
			
			if(cont) {
				//ATTENTION - Needd to add for course and teachers!
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
			}
		}
	};

	$scope.addAnswer = function (option) {
		if(option === 'add') {
			var ans = {
				answer: ''
			};
			$scope.answers.push(ans);
		} else if (option === 'delete') {
			$scope.answers.pop();
		}
		console.log($scope.answers);
	};
}]);