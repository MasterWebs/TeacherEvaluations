angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 'LoginResource', 'EvaluationResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource, EvaluationResource) {
	$scope.role = LoginResource.getRole();
	$scope.token = LoginResource.getToken();
	$scope.template = {};
	$scope.cQuestions = [];
	$scope.tQuestions = [];
	$scope.startDate = { value: new Date() };
	$scope.endDate = { value: new Date() };

	if ($scope.role !== 'admin') {
		$location.path('/login');
	} else {
		$scope.thisTemplate = EvaluationTemplateResource.getThisTemplate();  //only used to get ID
		EvaluationTemplateResource.getTemplate($scope.thisTemplate.ID)
		.success(function (response) {
			$scope.template = response;
			$scope.cQuestions = response.CourseQuestions;
			$scope.tQuestions = response.TeacherQuestions;
		})
		.error(function () {
			toastr.error("Could not fetch template");
		});
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