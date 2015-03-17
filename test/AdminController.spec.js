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

 	var mockEvaluationResource = {
 		init: function (token) { },
 		getEvaluations: function () {
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

		spyOn(mockLoginResource, 'getUser');
		spyOn(mockLoginResource, 'getToken');
		spyOn(mockLoginResource, 'getRole');
		spyOn(mockLoginResourceNoToken, 'getUser');
		spyOn(mockLoginResourceNoToken, 'getToken');
		spyOn(mockLoginResourceNoToken, 'getRole');
		spyOn(mockEvaluationTemplateResource, 'init');
		spyOn(mockEvaluationTemplateResource, 'getTemplates').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResource, 'setTemplate');
		spyOn(mockEvaluationTemplateResourceError, 'init');
		spyOn(mockEvaluationTemplateResourceError, 'getTemplates').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'getTemplate').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'setTemplate');
		spyOn(mockEvaluationResource, 'init');
		spyOn(mockEvaluationResource, 'getEvaluations').and.callThrough();
		spyOn(mockEvaluationResource, 'setEvaluation');
		spyOn(mockEvaluationResourceError, 'init');
		spyOn(mockEvaluationResourceError, 'getEvaluations').and.callThrough();
		spyOn(mockEvaluationResourceError, 'setEvaluation');
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
		});

		it('should initialize EvaluationTemplateResource and EvaluationResource', function () {
			expect(scope.evaluationTemplates.length).toEqual(0);
			expect(scope.evaluations.length).toEqual(0);
		});

		it('should redirect user to login', function () {
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the token is defined', function () {
		beforeEach(function () {
			controller = createController(true, false);
		});

		/* it('should call init in EvaluationTemplateResource and EvaluationResource', function () {
			expect(mockEvaluationTemplateResource.init).toHaveBeenCalled();
			expect(mockEvaluationResource.init).toHaveBeenCalled();
		}); */

		/* it('scope.role should equal admin', function () {
			expect(scope.role).toEqual('admin');
		}); */
	});
});