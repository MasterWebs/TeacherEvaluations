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

	EvaluationResource.init($scope.token);
	
	if ($scope.role !== 'admin') {
		$location.path('/login');
	}
	
	if ($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		
	}

	$scope.createEvaluation = function () {
		console.log($scope.template.ID);
		console.log($scope.startDate.value.toISOString());
		console.log($scope.endDate.value.toISOString());

		var evaluation = {
			TemplateID: $scope.template.ID,
			StartDate: $scope.startDate.value.toISOString(),
			EndDate: $scope.endDate.value.toISOString()
		};

		EvaluationResource.createEvaluation (evaluation)
		.success(function () {
			toastr.success("Created evaluation");
		})
		.error(function () {
			toastr.error("Could not create evaluation");
		});


	};

}]);