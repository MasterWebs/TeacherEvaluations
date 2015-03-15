angular.module('EvalApp').controller('CourseController', 
['$scope', '$location', 'CourseResource', 'LoginResource',
function ($scope, $location, CourseResource, LoginResource) {
	$scope.course = CourseResource.getCurrentCourse();
	$scope.semester = '1';
	$scope.teachers = [];
	
	CourseResource.getTeachers($scope.course.CourseID, $scope.semester)
	.success(function (response) {
		$scope.teachers = response;
	})
	.error(function () {
		toastr.error('Could not get teachers');
	});
}]);