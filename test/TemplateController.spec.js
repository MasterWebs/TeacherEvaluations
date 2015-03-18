describe('TemplateController', function () {
	var scope, controller, createController;

	var mockLoginResource = {
		getRole: function () { return 'admin'; },
		getToken: function () { return 't0k3n'; }
	};

	var mockLoginResourceNoToken = {
		getRole: function () { return ''; },
		getToken: function () { return ''; }
	};

	var evaluation = {
		ID: 1,
		Title: 'Kennslumat',
		TitleEN: 'Evaluation',
		IntroText: 'Þetta er kennslumat',
		IntroTextEN: 'This is an evaluation',
		CourseQuestions: [],
		TeacherQuestions: []
	};

	var mockEvaluationTemplateResource = {
		getTemplate: function (id) {
			return {
				success: function (fn) {
					fn(evaluation);
					return {
						error: function (errorFn) { }
					};
				}
			};
		},

		getThisTemplate: function () { return { ID: 1 }; }
	};

	var mockEvaluationTemplateResourceError = {
		getTemplate: function (id) {
			return {
				success: function (fn) {
					return {
						error: function (errorFn) { 
							errorFn();
						}
					};
				}
			};
		},

		getThisTemplate: function () { return { ID: 1 }; }
	};

	var mockEvaluationResource = {
		createEvaluation: function (evaluation) {
			return {
				success: function (fn) {
					fn();
					return {
						error: function (errorFn) { }
					};
				}
			};
		} 
	};

	var mockEvaluationResourceError = {
		createEvaluation: function (evaluation) {
			return {
				success: function (fn) {
					return {
						error: function (errorFn) {
							errorFn();
						}
					};
				}
			};
		} 
	};

	var mockLocation = {
		path: function (location) { }
	};

	beforeEach(function () {
		module('EvalApp');

		inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			createController = function (isToken, isError) {
				var mockLogin;
				var mockTemplate;
				var mockEvaluation;

				if (isToken) {
					mockLogin = mockLoginResource;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}

				if (isError) {
					mockTemplate = mockEvaluationTemplateResourceError;
					mockEvaluation = mockEvaluationResourceError;
				} else {
					mockTemplate = mockEvaluationTemplateResource;
					mockEvaluation = mockEvaluationResource;
				}

				return $controller('TemplateController',
				{ $scope: 					  scope,
				  $location: 				  mockLocation,
				  EvaluationTemplateResource: mockTemplate,
				  LoginResource: 			  mockLogin,
				  EvaluationResource: 		  mockEvaluation});
			};
		});

		spyOn(mockLoginResource, 'getToken').and.callThrough();
		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getToken').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockLocation, 'path');
		spyOn(toastr, 'error');
		spyOn(toastr, 'success');
		spyOn(mockEvaluationTemplateResource, 'getThisTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'getThisTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationResource, 'createEvaluation').and.callThrough();
		spyOn(mockEvaluationResourceError, 'createEvaluation').and.callThrough();
	});

	describe('when user is not logged in', function () {
		beforeEach(function () {
			controller = createController(false, true);
		});

		it('should get user info from LoginResource', function () {
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
			expect(mockLoginResourceNoToken.getToken).toHaveBeenCalled();
		});

		it('should initialize template, c- and tQuestions', function () {
			expect(scope.template).toEqual({});
			expect(scope.cQuestions.length).toEqual(0);
			expect(scope.tQuestions.length).toEqual(0);
		});

		it('should redirect user to login page', function () {
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the user is logged in', function () {
		describe('when EvaluationTemplateResource returns success', function () {
			it('should get template from EvaluationTemplateResource', function () {
				controller = createController(true, false);
				expect(mockEvaluationTemplateResource.getTemplate).toHaveBeenCalledWith(1);
				expect(scope.template).toEqual(evaluation);
				expect(scope.cQuestions).toEqual(evaluation.CourseQuestions);
				expect(scope.tQuestions).toEqual(evaluation.TeacherQuestions);
			});
		});

		describe('when EvaluationTemplateResource returns error', function () {
			it('should alert user with toastr', function () {
				controller = createController(true, true);
				expect(toastr.error).toHaveBeenCalledWith('Could not fetch template');
			});
		});

		describe('scope.createEvaluation', function () {
			describe('when EvaluationResource return success', function () {
				it('should call createEvaluation with correct information', function () {
					controller = createController(true, false);
					var evalu = {
						TemplateID: scope.template.ID,
						StartDate: scope.startDate.value.toISOString(),
						EndDate: scope.endDate.value.toISOString()
					};

					scope.createEvaluation();
					expect(mockEvaluationResource.createEvaluation).toHaveBeenCalledWith(evalu);
				});
			});

			describe('when EvaluationResource returns success', function () {
				it('should alert user that evaluation could not be created', function () {
					controller = createController(true, true);
					scope.createEvaluation();
					expect(toastr.error).toHaveBeenCalledWith('Could not create evaluation');
				});
			});
		});
	});
});