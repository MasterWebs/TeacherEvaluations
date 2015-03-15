angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 'LoginResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource) {
	$scope.role = LoginResource.getRole();
	$scope.template = EvaluationTemplateResource.getThisTemplate();
	$scope.cQuestions = $scope.template.CourseQuestions;
	$scope.tQuestions = $scope.template.TeacherQuestions;
	console.log($scope.cQuestions);

	if ($scope.role !== 'admin') {
		$location.path('/login');
	}
	
	if ($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		//
	}

}]);