describe('EvaluationResultController', function () {
	var scope, controller, createController;

	var mockLoginResource = {
		getRole: function () {
			return 'admin';
		}
	};

	var mockLoginResourceNoToken = {
		getRole: function () {
			return '';
		}
	};

	var evaluation = {
		ID: 1,
		TemplateID: 1,
		TemplateTitle: 'Kennslumat',
		TemplateTitleEN: 'Evaluation',
		Courses: [
			{ ID: 1,
			CourseID: 'WEPO-T-214',
			Semester: '20151',
			CourseName: 'Vefforritun',
			CourseNameEN: 'Web Programming',
			Questions: [
				{
					QuestionID: 1,
					Text: 'Textaspurning',
					TextEN: 'Text question',
					Type: 'text',
					TextResults: [ 'Einmitt', 'Nefnilega' ],
					OptionsResults: undefined
				} , {
					QuestionID: 2,
					Text: 'Einvalsspurning',
					TextEN: 'Single choice question',
					Type: 'single',
					TextResults: undefined,
					OptionsResults: [
						{ Answer: 1,
						  AnswerText: 'Já',
						  AnswerTextEN: 'Yes',
						  Weight: 5,
						  Count: 2 },
						{ Answer: 2,
						  AnswerText: 'Nei',
						  AnswerTextEN: 'No',
						  Weight: 1,
						  Count: 1 }
					]
				}
			] }
		]
	};

	var mockEvaluationResource = {
		getThisEvaluation: function () { return { ID: 1 }; },
		getEvaluation: function (evaluationID) {
			return {
				success: function (fn) {
					fn(evaluation);
					return {
						error: function (errorFn) { }
					};
				}
			};
		}
	};

	var mockEvaluationResourceError = {
		getThisEvaluation: function () { return { ID: 1 }; },
		getEvaluation: function (evaluationID) {
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
				var mockEvaluation;

				if (isToken) {
					mockLogin = mockLoginResource;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}

				if (isError) {
					mockEvaluation = mockEvaluationResourceError;
				} else {
					mockEvaluation = mockEvaluationResource;
				}

				return $controller('EvaluationResultController',
				{ $scope: 					  scope,
				  $location: 				  mockLocation,
				  LoginResource: 			  mockLogin,
				  EvaluationResource: 		  mockEvaluation });
			};
		});

		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockEvaluationResource, 'getThisEvaluation').and.callThrough();
		spyOn(mockEvaluationResource, 'getEvaluation').and.callThrough();
		spyOn(mockEvaluationResourceError, 'getThisEvaluation').and.callThrough();
		spyOn(mockEvaluationResourceError, 'getEvaluation').and.callThrough();
		spyOn(toastr, 'error');
		spyOn(mockLocation, 'path');
	});

	describe('when the user is not logged in', function () {
		beforeEach(function () {
			controller = createController(false, false);
		});

		it('should get user role from LoginResource', function () {
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
		});

		it('should redirect user to login', function () {
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the user is logged in', function () {
		describe('when EvaluationResource returns success', function () {
			beforeEach(function () {
				controller = createController(true, false);
			});

			it('should get current evaluation from EvaluationResource', function () {
				expect(mockEvaluationResource.getThisEvaluation).toHaveBeenCalled();
			});

			it('should get evaluation from EvaluationResource', function () {
				expect(mockEvaluationResource.getEvaluation).toHaveBeenCalledWith(1);
			});

			describe('scope.updateCourse', function () {
				it('should update question arrays when single', function () {
					scope.qType.opt = 'single';
					scope.updateCourse(evaluation.Courses[0]);
				});

				it('should update question arrays when multiple', function () {
					scope.qType.opt = 'multiple';
					scope.updateCourse(evaluation.Courses[0]);
				});
			});

			describe('updateType', function () {
				it('should call updateCourse', function () {
					scope.course = evaluation.Courses[0];
					scope.updateType();
				});
			});
		});
		
		describe('when EvaluationResource returns error', function () {
			beforeEach(function () {
				controller = createController(true, true);
			});

			it('should alert user with toastr', function () {
				expect(toastr.error).toHaveBeenCalled();
			});
		});
	});
});