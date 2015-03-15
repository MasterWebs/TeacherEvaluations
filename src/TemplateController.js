angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 'LoginResource', 
function ($scope, $location, EvaluationTemplateResource, LoginResource) {
	$scope.role = LoginResource.getRole();
	$scope.template = EvaluationTemplateResource.getThisTemplate();
	console.log($scope.template);

	if ($scope.role !== 'admin') {
		$location.path('/login');
	}
	
	if ($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		console.log($scope.template);
	}

}]);