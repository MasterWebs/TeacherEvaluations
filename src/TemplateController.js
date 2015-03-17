angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 'LoginResource', 'EvaluationResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource, EvaluationResource) {
	$scope.role = LoginResource.getRole();
	$scope.token = LoginResource.getToken();
	$scope.thisTemplate = EvaluationTemplateResource.getThisTemplate();  //only used to get ID
	$scope.template = {};
	$scope.cQuestions = {};
	$scope.tQuestions = {};
	$scope.startDate = { value: new Date() };
	$scope.endDate = { value: new Date() };

	console.log($scope.thisTemplate.ID);

	if ($scope.role !== 'admin') {
		$location.path('/login');
	} else {
		EvaluationTemplateResource.getTemplate($scope.thisTemplate.ID)
		.success(function (response) {
			console.log(response);
			$scope.template = response;
			$scope.cQuestions = response.CourseQuestions;
			$scope.tQuestions = response.TeacherQuestions;
			console.log($scope.tQuestions);
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