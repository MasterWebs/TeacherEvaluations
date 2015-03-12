describe('CreateTemplateController', function () {
	//Tests locic of CreateTemplateController

	beforeEach(module('EvalApp'));

	var $controller;

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.createQuestion', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};

			spyOn(toastr, 'error');
			spyOn(toastr, 'success');

			controller = $controller('CreateTemplateController',
				{ $scope:   	$scope });
		});

		it('Should reject create question when text is empty', function () {
			$scope.qText = '';
			$scope.createQuestion();
			//expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

	});

});