angular.module('EvalApp').controller('StudentEvaluationController',
['$scope', '$location', 'LoginResource', 'CourseResource',
function ($scope, $location, LoginResource, CourseResource) {
	$scope.role = LoginResource.getRole();
	$scope.courseEvaluation = CourseResource.getThisEvaluation();
	//$scope.course = CourseResource.getThisCourse(); DONT NEED I THINK
	$scope.evaluation = {};	
	$scope.courseQuestions = {};
	$scope.teacherQuestions = {};
	$scope.answers = [];
	//SEMESTER
	
	if($scope.role !== 'student') {
		$location.path('/login');
	} else {

		CourseResource.getEvaluation($scope.courseEvaluation.CourseID, '1', $scope.courseEvaluation.ID )
		.success(function (response) {
			$scope.evaluation = response;
			$scope.courseQuestions = response.CourseQuestions;
			$scope.teacherQuestions = response.TeacherQuestions;
			console.log($scope.evaluation);
		})
		.error(function () {
			toastr.error('Could not fetch evaluation');
		});

	}

}]);