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


	$scope.labels = []; 
	$scope.data = [];


  	$scope.onClick = function (points, evt) {
    	console.log(points, evt);
  	};


	if ($scope.role === 'admin') {
		$scope.thisEvaluation = EvaluationResource.getThisEvaluation();
		//console.log($scope.thisEvaluation);

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
				//$scope.course = $scope.courseOption[0];
			});
		})
		.error(function () {
			toastr.error('Could not fetch evaluation result');
		});


	} else {
		$location.path('/login');
	}


	/*$scope.getQuestion = function (q) {
		console.log(q);
		console.log(q.Type);
		if(q.Type === 'single') {
			angular.forEach(q.OptionResults, function (obj) {
				var opResult = {
					Answer: obj.Answer,
					AnswerText: obj.AnswerText,
					AnswerTextEN: obj.AnswerTextEN,
					Weight: obj.Weight,
					Count: obj.Count
				};
				
				$scope.optionsResults.push(opResult);
			});	
		} else {  //text question

		}

		console.log($scope.optionsResults);
		
	};*/

	$scope.updateCourse = function (c) {
		//console.log(c);

		//if($scope.qType.opt === 'single') {
			angular.forEach(c.Questions, function (obj) {
				var question = {};
					if(obj.Type === 'single') {
						console.log("in");
						question = {
							QuestionID: obj.QuestionID,
							Text: obj.Text,
							TextEN: obj.TextEN,
							TeacherSSN: obj.TeacherSSN,
							Type: obj.Type,
							TextResults: obj.TextResults,
							OptionResults: obj.OptionsResults
						};
						$scope.questionOption.push(question);
					}
			});

			$scope.question = $scope.questionOption[0];

			angular.forEach($scope.question.OptionResults, function (obj) {
				$scope.labels.push(obj.AnswerText);
				$scope.data.push(obj.Count);
			});


		/*} else {	//text
			console.log('text');
		}*/

	};

	$scope.updateType = function () {
		if($scope.qType = $scope.qTypeOption[0]) {
			$scope.qType = $scope.qTypeOption[1]; 
		} else {
			$scope.qType = $scope.qTypeOption[0]; 
		}
	};
}]);