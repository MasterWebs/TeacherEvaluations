angular.module('EvalApp').controller('EvaluationResultController', 
['$scope', '$location', 'LoginResource', 'EvaluationResource', 
function ($scope, $location, LoginResource, EvaluationResource) {
	$scope.role = LoginResource.getRole();
	$scope.evalResult = {};
	$scope.courses = [];
	$scope.questions = [];
	$scope.optionResults = [];


	if ($scope.role === 'admin') {
		$scope.thisEvaluation = EvaluationResource.getThisEvaluation();
		//console.log($scope.thisEvaluation);

		EvaluationResource.getEvaluation($scope.thisEvaluation.ID)
		.success(function (response) {
			$scope.evalResult = response;
			angular.forEach (response.Courses, function(obj) {
				var course = {
					Name: obj.CourseName,
					NameEN: obj.CourseNameEN,
					Semester: obj.Semester,
					Questions: obj.Questions
				};
				$scope.courses.push(course);
			});
			angular.forEach ($scope.courses, function (obj) {
				var question = {
					QuestionID: obj.QuestionID,
					Text: obj.Text,
					TextEN: obj.TextEN,
					TeacherSSN: obj.TeacherSSN,
					Type: obj.Type,
					TextResult: obj.TextResult,
					OptionResults: obj.OptionResults
				};
				$scope.questions.push(question);
			});
			angular.forEach ($scope.questions, function (obj) {
				var result = {
					Answer: obj.Answer,
					AnswerText: obj.AnswerText,
					AnswerTextEN: obj.AnswerTextEN,
					Weight: obj.Weight,
					Count: obj.Count
				};
				$scope.optionResults.push(result);
			});
		})
		.error(function () {
			toastr.error('Could not fetch evaluation result');
		});
	} else {
		$location.path('/login');
	}
}]);