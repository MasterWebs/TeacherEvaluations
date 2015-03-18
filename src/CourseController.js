angular.module('EvalApp').controller('CourseController', 
['$scope', '$location', 'CourseResource', 'LoginResource',
function ($scope, $location, CourseResource, LoginResource) {
	$scope.role = LoginResource.getRole();
	$scope.semester = '1';
	$scope.teachers = [];	

	if($scope.role !== 'student') {
		toastr.error('You are not a student');
		$location.path('/login');
	} else {
		$scope.course = CourseResource.getThisCourse();
		CourseResource.getTeachers($scope.course.CourseID, $scope.semester)
		.success(function (response) {
			$scope.teachers = response;
		})
		.error(function () {
			toastr.error('Could not get teachers');
		});
	}
}]);