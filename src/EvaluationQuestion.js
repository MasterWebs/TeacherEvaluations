angular.module('EvalApp').directive('evaluationQuestion',
function () {
	return {
		restrict: 'E',
		scope: {
			question: '=question'
		},
		templateUrl: 'views/evaluationQuestion.tpl.html',
		link: function (scope, element, attributes) {

		}
	};
});