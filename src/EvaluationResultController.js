angular.module('EvalApp').controller('EvaluationResultController', 
['$scope', '$location', 'LoginResource', 'EvaluationResource', '$timeout', 
function ($scope, $location, LoginResource, EvaluationResource, $timeout) {
	$scope.role = LoginResource.getRole();
	$scope.evalResult = {};
	$scope.qTypeOption = [ {opt: 'text'}, {opt: 'single'} ];
	$scope.qType = $scope.qTypeOption[0];
	$scope.courseOption = [];
	$scope.course = $scope.courseOption[0];
	$scope.questionOption = [];
	$scope.question = $scope.questionOption[0]; 
	$scope.OptionResults = [];
	$scope.questionText = [];
	$scope.textQuestion = $scope.questionText[0];
	$scope.textAnswer = [];
	$scope.labels = []; 
	$scope.data = [];

	if ($scope.role === 'admin') {
		$scope.thisEvaluation = EvaluationResource.getThisEvaluation();

		EvaluationResource.getEvaluation($scope.thisEvaluation.ID)
		.success(function (response) {
			$scope.evalResult = response;
			angular.forEach (response.Courses, function(obj) {
				var course = {
					ID: obj.ID,
					Name: obj.CourseName,
					NameEN: obj.CourseNameEN,
					Semester: obj.Semester,
					Questions: obj.Questions
				};
				$scope.courseOption.push(course);
			});
		})
		.error(function () {
			toastr.error('Could not fetch evaluation result');
		});


	} else {
		$location.path('/login');
	}

	$scope.updateCourse = function (c) {
		//remove prevous data
		$scope.questionOption = []; 
		$scope.questionText = []; 
		$scope.textAnswer = [];
		$scope.labels = [];
		$scope.data = [];

		angular.forEach(c.Questions, function (obj) {
			var question = {
				QuestionID: obj.QuestionID,
				Text: obj.Text,
				TextEN: obj.TextEN,
				TeacherSSN: obj.TeacherSSN,
				Type: obj.Type,
				TextResults: obj.TextResults,
				OptionResults: obj.OptionsResults
			};
				if(obj.Type === 'single') {
					$scope.questionOption.push(question);
				} else {
					$scope.questionText.push(question);
				}
		});

		if($scope.qType.opt === 'single') {
			$scope.question = $scope.questionOption[0];
			angular.forEach($scope.question.OptionResults, function (obj) {
				$scope.labels.push(obj.AnswerText);
				$scope.data.push(obj.Count);
			});
		} else {	//text
			$scope.textQuestion = $scope.questionText[0];
			angular.forEach($scope.textQuestion.TextResults, function (obj) {
				$scope.textAnswer.push(obj);
			});
		}
	};

	$scope.updateType = function () {
		$scope.updateCourse($scope.course);
	};

	$scope.onClick = function (points, evt) {
    	console.log(points, evt);
  	};
}]);