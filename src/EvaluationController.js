angular.module('EvalApp').controller('EvaluationController',
['$scope', '$location', 'LoginResource', 'EvaluationResource',
function ($scope, $location, LoginResource, EvaluationResource) {
	$scope.evaluation = EvaluationResource.getThisEvaluation();
	console.log($scope.evaluation.Courses);

	EvaluationResource.getEvaluation($scope.evaluation.ID)
	.success(function () {

	})
	.error(function () {
		toastr.error("Could not fetch evaluation");
	});
}]);