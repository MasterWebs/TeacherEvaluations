angular.module('EvalApp').controller('StudentEvaluationController',
['$scope', '$location', 'LoginResource', 'CourseResource',
function ($scope, $location, LoginResource, CourseResource) {
	$scope.role = LoginResource.getRole();
	$scope.courseEvaluation = CourseResource.getThisEvaluation();
	//$scope.course = CourseResource.getThisCourse(); DONT NEED I THINK
	$scope.evaluation = {};	
	$scope.courseQuestions = [];
	$scope.teacherQuestions = [];
	$scope.answers = [];
	//SEMESTER
	
	if($scope.role !== 'student') {
		$location.path('/login');
	} else {
		CourseResource.getEvaluation($scope.courseEvaluation.CourseID, '1', $scope.courseEvaluation.ID )
		.success(function (response) {
			$scope.evaluation = response;

			angular.forEach(response.CourseQuestions, function (obj) {
				var q = { question: obj, answer: '' };
				if (obj.Type === 'text') {
					q.answer = '';
				} else if (obj.Type === 'single') {
					q.answer = obj.Answers[0].ID;
				} else if (obj.Type === 'multiple') {
					q.answer = [];
				}
				this.push(q);
			}, $scope.courseQuestions);

			angular.forEach(response.TeacherQuestions, function (obj) {
				var q = { question: obj, answer: '' };
				if (obj.Type === 'text') {
					q.answer = '';
				} else if (obj.Type === 'single') {
					q.answer = obj.Answers[0].ID;
				} else if (obj.Type === 'multiple') {
					q.answer = [];
				}
				this.push(q);
			}, $scope.teacherQuestions);
		})
		.error(function () {
			toastr.error('Could not fetch evaluation');
		});
	}

	$scope.submitEvaluation = function () {
		$scope.results = [];
	};
}]);