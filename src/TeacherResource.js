angular.module('EvalApp').factory('TeacherResource',
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var teacher = {};

	return {
		getTeacher: function () {
			return teacher;
		},
		setTeacher: function (_teacher) {
			teacher = _teacher;
		}
	};
}]);