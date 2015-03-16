angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 'LoginResource', 'EvaluationResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource, EvaluationResource) {
	$scope.role = LoginResource.getRole();
	$scope.token = LoginResource.getToken();
	$scope.template = EvaluationTemplateResource.getThisTemplate();
	$scope.cQuestions = $scope.template.CourseQuestions;
	$scope.tQuestions = $scope.template.TeacherQuestions;
	$scope.startDate = { value: new Date() };
	$scope.endDate = { value: new Date() };

	//EvaluationResource.init($scope.token);

	if ($scope.role !== 'admin') {
		$location.path('/login');
	}
	
	if ($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		
	}

	$scope.createEvaluation = function () {
		var evaluation = {
			TemplateID: $scope.template.ID,
			StartDate: $scope.startDate.value.toISOString(),
			EndDate: $scope.endDate.value.toISOString()
		};

		EvaluationResource.createEvaluation (evaluation)
		.success(function () {
			toastr.success("Created evaluation");
			$location.path('/admin');
		})
		.error(function () {
			toastr.error("Could not create evaluation");
		});


	};

}]);