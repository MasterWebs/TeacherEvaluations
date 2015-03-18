describe('StudentEvaluationController', function () {
	var scope, controller, createController;

	var mockLoginResource = {
		getRole: function () { return 'student'; }
	};

	var mockLoginResourceNoToken = {
		getRole: function () { return ''; }
	};

	var evaluation = {
		ID: 1,
		Title: 'Kennslumat',
		TitleEN: 'Evaluation',
		IntroText: 'Þetta er kennslumat',
		IntroTextEN: 'This is an evaluation',
		CourseQuestions: [
			{ ID: 1,
			  Text: 'Textaspurning',
			  TextEN: 'Text question',
			  Type: 'text' },
			{ ID: 2,
			  Text: 'Einvalsspurning' ,
			  TextEN: 'Single choice question',
			  Type: 'single',
			  Answers: [
			  	{ ID: 1, Text: 'Já', TextEN: 'Yes' },
			  	{ ID: 2, Text: 'Nei', TextEN: 'No' }
			  ] }
		],
		TeacherQuestions: [
			{ ID: 3,
			  Text: 'Textaspurning',
			  TextEN: 'Text question',
			  Type: 'text' },
			{ ID: 4,
			  Text: 'Einvalsspurning' ,
			  TextEN: 'Single choice question',
			  Type: 'single',
			  Answers: [
			  	{ ID: 3, Text: 'Já', TextEN: 'Yes' },
			  	{ ID: 4, Text: 'Nei', TextEN: 'No' }
			  ] }
		]
	};

	var mockCourseResource = {
		getThisEvaluation: function () {
			return { CourseID: 1, ID: 1 };
		},
		getEvaluation: function (courseID, semester, evalID) {
			return {
				success: function (fn) {
					fn(evaluation);
					return {
						error: function (errorFn) { }
					};
				}
			};
		},
		saveAnswers: function () {
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

	var mockCourseResourceError = {
		getThisEvaluation: function () {
			return { CourseID: 1, ID: 1 };
		},
		getEvaluation: function (courseID, semester, evalID) {
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
		saveAnswers: function () {
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

		inject(function ($rootScope, $controller) {
			scope = $rootScope.$new();

			createController = function (isToken, isError) {
				var mockLogin;
				var mockCourse;

				if (isToken) {
					mockLogin = mockLoginResource;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}

				if (isError) {
					mockCourse = mockCourseResourceError;
				} else {
					mockCourse = mockCourseResource;
				}

				return $controller('StudentEvaluationController',
				{ $scope: 			scope,
				  $location: 		mockLocation,
				  LoginResource: 	mockLogin,
				  CourseResource: 	mockCourse });
			};
		});

		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockLocation, 'path');
		spyOn(mockCourseResource, 'getThisEvaluation').and.callThrough();
		spyOn(mockCourseResource, 'getEvaluation').and.callThrough();
		spyOn(mockCourseResource, 'saveAnswers').and.callThrough();
		spyOn(mockCourseResourceError, 'getThisEvaluation').and.callThrough();
		spyOn(mockCourseResourceError, 'getEvaluation').and.callThrough();
		spyOn(mockCourseResourceError, 'saveAnswers').and.callThrough();
		spyOn(toastr, 'success');
		spyOn(toastr, 'error');
	});

	describe('when the user is not logged in', function () {
		beforeEach(function () {
			controller = createController(false, false);
		});

		it('should get role from LoginResource', function () {
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
		});

		it('should initialize scope variables', function () {
			expect(scope.semester).toEqual(1);
			expect(scope.evaluation).toEqual({});
			expect(scope.courseQuestions).toEqual([]);
			expect(scope.teacherQuestions).toEqual([]);
			expect(scope.answers).toEqual([]);
		});
	});

	describe('when the user is logged in', function () {
		describe('when courseResource returns success', function () {
			beforeEach(function () {
				controller = createController(true, false);
			});

			it('should get current evaluation info from CourseResource', function () {
				expect(mockCourseResource.getThisEvaluation).toHaveBeenCalled();
			});

			it('should get the evaluation from CourseResource', function () {
				expect(mockCourseResource.getEvaluation).toHaveBeenCalledWith(1, '1', 1);
			});

			it('should set scope.evaluation as the response from server', function () {
				expect(scope.evaluation).toEqual(evaluation);
			});

			it('should populate courseQuestions with question and answer pairs', function () {
				var cQuestions = [
					{ question: evaluation.CourseQuestions[0], answer: '' },
					{ question: evaluation.CourseQuestions[1], answer: 1 }
				];

				expect(scope.courseQuestions).toEqual(cQuestions);
			});

			it('should populate teacherQuestions with question and answer pairs', function () {
				var tQuestions = [
					{ question: evaluation.TeacherQuestions[0], answer: '' },
					{ question: evaluation.TeacherQuestions[1], answer: 3 }
				];

				expect(scope.teacherQuestions).toEqual(tQuestions);
			});

			describe('scope.submitEvaluation', function () {
				beforeEach(function () {
					scope.courseQuestions[0].answer = 'Svar';
					scope.courseQuestions[1].answer = 1;
					scope.teacherQuestions[0].answer = 'Svar';
					scope.teacherQuestions[1].answer = 3;
				});

				it('should call saveAnswers in CourseResource and alert user with toastr', function () {
					var results = [
						{ QuestionID: 1, Value: 'Svar' },
						{ QuestionID: 2, Value: 1 },
						{ QuestionID: 3, Value: 'Svar' },
						{ QuestionID: 4, Value: 3 },
					];
					scope.submitEvaluation();
					expect(mockCourseResource.saveAnswers).toHaveBeenCalledWith(1, '1', 1, results);
					expect(toastr.success).toHaveBeenCalledWith('Saved your answers');
				});
			});
		});

		describe('when courseResource returns error', function () {
			beforeEach(function () {
				controller = createController(true, true);
			});

			it('should alert user that evaluation could not be fetched', function () {
				expect(toastr.error).toHaveBeenCalledWith('Could not fetch evaluation');
			});

			describe('scope.submitEvaluation', function () {
				it('should alert user with toastr', function () {
					scope.submitEvaluation();
					expect(toastr.error).toHaveBeenCalledWith('Could not save your answers');
				});
			});
		});
	});
});