angular.module('EvalApp').controller('EvaluationController',
['$scope', '$location', 'LoginResource', 'EvaluationResource',
function ($scope, $location, LoginResource, EvaluationResource) {
	$scope.role = LoginResource.getRole();
	$scope.thisEvaluation = EvaluationResource.getThisEvaluation();
	$scope.evaluation = [];
	
	if($scope.role !== 'admin') {
		toastr.error('Please login as admin');
		$location.path('/login');
	} else {
		EvaluationResource.getEvaluation($scope.thisEvaluation.ID)
		.success(function (response) {
			console.log(response);
			$scope.evaluation = response;
		})
		.error(function () {
			toastr.error("Could not fetch evaluation");
		});
	}
}]);