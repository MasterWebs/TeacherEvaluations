angular.module('EvalApp').controller('TeacherController', 
['$scope', 'TeacherResource', 
function ($scope, TeacherResource) {
	$scope.teacher = TeacherResource.getTeacher();
	console.log($scope.teacher);
}]);