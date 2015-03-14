angular.module('EvalApp').controller('TemplateController',
['$scope', '$location', 'EvaluationTemplateResource', 
function ($scope, $location, EvaluationTemplateResource) {
	$scope.template = EvaluationTemplateResource.getThisTemplate();


	if($scope.template === undefined) {
		toastr.error("undefined template");
	} else {
		console.log($scope.template);
	}

}]);