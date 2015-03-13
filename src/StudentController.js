angular.module('EvalApp').controller('StudentController',
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {

	if(LoginResource.isLoggedIn()) {
		$scope.token = LoginResource.getToken();
		$scope.currentUser = LoginResource.getUser();
		$scope.myCourses = [];
		$scope.myEvaluations = [];

		MyResource.init($scope.token);  //Initialize token and config in MyResource
		
		MyResource.courses()
		.success(function (response) {
			$scope.myCourses = response;
			toastr.success('Fetched courses');

		})
		.error(function () {
			toastr.error('Something went wrong');
		});

		MyResource.evaluations()
		.success (function (response) {
			$scope.myEvaluations = response;
			toastr.success('Fetched evaluations');
		})
		.error (function () {
			toastr.error('Could not fetch your evaluations');
		});
	} else {
		toastr.error('No user logged in!');
	}
}]);