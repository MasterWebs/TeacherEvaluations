angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource) {
	$scope.role = LoginResource.getRole();
	$scope.template = EvaluationTemplateResource.getThisTemplate();

	if ($scope.role !== 'admin') {
		$location.path('/login');
	}
	
	if ($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		console.log($scope.template);
	}

}]);