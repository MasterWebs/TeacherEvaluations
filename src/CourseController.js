angular.module('EvalApp').controller('CourseController', 
['$scope', '$location', 'CourseResource', 'LoginResource', 'TeacherResource',
function ($scope, $location, CourseResource, LoginResource, TeacherResource) {
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

	$scope.getTeacher = function (teacher) {
		TeacherResource.setTeacher(teacher);
		$location.path('/teacher/' + teacher.Username);
	};
}]);