describe('AdminController', function () {
	var controller, scope, createController;

	var mockLoginResource = {
		getUser: function () { return 'admin'; },
		getRole: function () { return 'admin'; },
		getToken: function () { return 't0k3n'; },
		isLoggedIn: function () { return true; }
	};

	var mockLoginResourceNoToken = {
		getUser: function () { return ''; },
		getRole: function () { return ''; },
		getToken: function () { return ''; },
		isLoggedIn: function () { return false; }
	};

	var mockLocation = {
		path: function (location) { }
	};

	var mockEvaluationTemplateResource = {
		init: function (token) { },
		getTemplates: function () {
			return {
				success: function (fn) {
					var response = [];
					fn(response);
					return {
						error: function (errorFn) {

						}
					};
				}
			};
		},
		getTemplate: function (ID) {
			return {
				success: function (fn) {
					var response = [];
					fn(response);
					return {
						error: function (errorFn) {

						}
					};
				}
			};
		},
		setTemplate: function (template) { }
	};

	var mockEvaluationTemplateResourceError = {
		init: function (token) { },
		getTemplates: function () {
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
		getTemplate: function (ID) {
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
		setTemplate: function (template) { }
 	};

 	var evaluations = [
 		{ ID: 1, Status: 'new' },
 		{ ID: 2, Status: 'open' },
 		{ ID: 3, Status: 'closed' }
 	];

 	var mockEvaluationResource = {
 		init: function (token) { },
 		getEvaluations: function () {
 			return {
 				success: function (fn) {
 					fn(evaluations);
 					return {
 						error: function (errorFn) {

 						}
 					};
 				}
 			};
 		},
 		setEvaluation: function (evaluation) { }
 	};

 	var mockEvaluationResourceError = {
 		init: function (token) { },
 		getEvaluations: function () {
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
 		setEvaluation: function (evaluation) { }
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

 				return $controller('AdminController',
 				{ $scope: 					  scope,
 				  $location: 				  mockLocation,
 				  LoginResource: 			  mockLogin,
 				  EvaluationTemplateResource: mockTemplate,
 				  EvaluationResource: 		  mockEvaluation });
 			};
 		});

		spyOn(mockLoginResource, 'getUser').and.callThrough();
		spyOn(mockLoginResource, 'getToken').and.callThrough();
		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getUser').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getToken').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'init');
		spyOn(mockEvaluationTemplateResource, 'getTemplates').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'setTemplate');
		/* spyOn(mockEvaluationTemplateResourceError, 'init');
		spyOn(mockEvaluationTemplateResourceError, 'getTemplates').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'setTemplate'); */
		spyOn(mockEvaluationResource, 'init');
		spyOn(mockEvaluationResource, 'getEvaluations').and.callThrough();
		spyOn(mockEvaluationResource, 'setEvaluation');
		/*spyOn(mockEvaluationResourceError, 'init');
		spyOn(mockEvaluationResourceError, 'getEvaluations').and.callThrough();
		spyOn(mockEvaluationResourceError, 'setEvaluation'); */
		spyOn(mockLocation, 'path');
		spyOn(toastr, 'error');
 	});

	describe('when token is not defined', function () {
		beforeEach(function () {
			controller = createController(false, true);
		});

		it('should get user info from LoginResource', function () {
			expect(mockLoginResourceNoToken.getUser).toHaveBeenCalled();
			expect(mockLoginResourceNoToken.getToken).toHaveBeenCalled();
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
			expect(scope.role).toEqual('');
		});

		it('should initialize EvaluationTemplateResource and EvaluationResource', function () {
			expect(scope.evaluationTemplates.length).toEqual(0);
			expect(scope.evaluations.length).toEqual(0);
		});

		it('should redirect user to login', function () {
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the token is defined and server returns success', function () {
		beforeEach(function () {
			controller = createController(true, false);
		});

		it('should call init in EvaluationTemplateResource and EvaluationResource', function () {
			expect(mockEvaluationTemplateResource.init).toHaveBeenCalled();
			expect(mockEvaluationResource.init).toHaveBeenCalled();
		});

		it('should call getEvaluations and getTemplates in their respective resources', function () {
			expect(mockEvaluationTemplateResource.getTemplates).toHaveBeenCalled();
			expect(mockEvaluationResource.getEvaluations).toHaveBeenCalled();
		});

		it('should redirect user to create when redirect(create) is called', function () {
			scope.createTemplate();
			expect(mockLocation.path).toHaveBeenCalledWith('/create-template');
		});

		it('should change template in EvaluationTemplateResource when getTemplate is called and redirect', function () {
			var template = {
				ID: 1,
				Title: 'Sniðmát',
				TitleEN: 'Template',
				IntroText: 'Þetta er sniðmát',
				IntroTextEN: 'This is a template',
				CourseQuestions: [],
				TeacherQuestions: []
			};
			scope.getTemplate(template);
			expect(mockEvaluationTemplateResource.setTemplate).toHaveBeenCalledWith(template);
			expect(mockLocation.path).toHaveBeenCalledWith('/template/1');
		});

		it('should change evaluation in EvaluationResource when getEvaluation is called and redirect', function () {
			var evaluation = {
				ID: 1,
				TemplateTitle: 'Könnun',
				TemplateTitleEN: 'Survey'
			};
			scope.getEvaluation(evaluation);
			expect(mockEvaluationResource.setEvaluation).toHaveBeenCalledWith(evaluation);
			expect(mockLocation.path).toHaveBeenCalledWith('evaluation/1');
		});

		it('should add evaluations to their respective arrays', function () {
			expect(scope.openEvaluations).toEqual([{ ID: 2, Status: 'open' }]);
			expect(scope.closedEvaluations).toEqual([{ ID: 3, Status: 'closed' }]);
			expect(scope.newEvaluations).toEqual([{ ID: 1, Status: 'new' }]);
		});

		it('should redirect admin to evaluations result page when evalResult is called', function () {
			scope.evalResult({ ID: 1 });
			expect(mockEvaluationResource.setEvaluation).toHaveBeenCalledWith({ ID: 1 });
			expect(mockLocation.path).toHaveBeenCalledWith('evaluation/1');
		});
	});

	describe('when server returns error', function () {
		beforeEach(function () {
			controller = createController(true, true);
		});

		it('should alert that evaluations and templates could not be fetched', function () {
			expect(toastr.error).toHaveBeenCalledWith('Could not fetch evaluations');
			expect(toastr.error).toHaveBeenCalledWith('Could not fetch all evaluation templates');
		});
	});
});