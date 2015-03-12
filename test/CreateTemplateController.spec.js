describe('CreateTemplateController', function () {
	//Tests locic of CreateTemplateController

	beforeEach(module('EvalApp'));

	var $controller;

	var mockLoginResource = {
		login: function (user, pass) {
			return {
				success: function (fn) {
					var response = {};
					if (user === 'snaebjorn13' && pass === '123456') {
						response = {
							Token: 'ajfsjsafjab',
							User: {
								Username: 'snaebjorn13',
								Role: 'student'
							}
						};
						fn(response);
					} else if (user === 'admin' && pass === '123456') {
						response = {
							Token: 'jafjsaja',
							User: {
								Username: 'admin',
								Role: 'admin'
							}
						};
						fn(response);
					}
					return {
						error: function (errorFn) {
							if (user !== 'snaebjorn13' && pass === '123456') {
								errorFn();
							}
						}
					};
				}
			};
		},

		setUser: function (user) { },
		setRole: function (pass) { },
		setToken: function (token) { }
	};

	var mockLocation = {
		path: function (location) { }
	};

	var mockEvaluationTemplateResource = {
		create: function (tObj) {
			return {
				success: function (fn) {
					// call fn() if success
					if (tObj.tID !== null && tObj.Title !== '' && tObj.TitleEn !== '' && tObj.IntroText !== '' && 
						tObj.IntroTextEN !== '' && tObj.TeacherQuestions.length !== 0) {
						fn();
					}
					return {
						error: function (errorFn) {
							// call errorFn() if error
							if (tObj.tID !== null || tObj.Title || '' && tObj.TitleEn !== '' || tObj.IntroText !== '' || 
								tObj.IntroTextEN !== '' || tObj.TeacherQuestions.length !== 0) {
								errorFn();
							}
						}
					};
				}	
			};
		}
	};	

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