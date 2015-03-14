angular.module('EvalApp').controller('StudentController',
['$scope', '$location','LoginResource', 'MyResource', 'CourseResource',
function ($scope, $location, LoginResource, MyResource, CourseResource ) {

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

		$scope.route = function (course) {
			CourseResource.init($scope.token, course);
			$location.path('/course/' + course.ID);
		};
	} else {
		toastr.error('No user logged in!');
	}
}]);