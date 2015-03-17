angular.module('EvalApp').controller('StudentController',
['$scope', '$location', 'LoginResource', 'MyResource', 'CourseResource',
function ($scope, $location, LoginResource, MyResource, CourseResource ) {
	$scope.role = LoginResource.getRole();
	$scope.token = LoginResource.getToken();
	$scope.currentUser = LoginResource.getUser();
	$scope.myCourses = [];
	$scope.myEvaluations = [];

	if($scope.role !== 'student') {
		toastr.error('You are not a student');
		$location.path('/login');
	} else {
		MyResource.init($scope.token);  //Initialize token and config in MyResource
		
		MyResource.courses()
		.success(function (response) {
			$scope.myCourses = response;
		})
		.error(function () {
			toastr.error('Could not fetch your courses');
		});

		MyResource.evaluations()
		.success (function (response) {
			$scope.myEvaluations = response;
		})
		.error (function () {
			toastr.error('Could not fetch your evaluations');
		});

		$scope.route = function (course) {
			CourseResource.init($scope.token, course);
			$location.path('/course/' + course.ID);
		};

		$scope.evaluation = function (evalu) {
			console.log(evalu.ID);
			$location.path('/student-evaluation/' + evalu.ID);
		};
	}
}]);