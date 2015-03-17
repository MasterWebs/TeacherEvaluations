describe('CreateTemplateController', function () {
	//Tests locic of CreateTemplateController
	var controller, scope, createController;

	var mockLoginResource = {
		getRole: function () { return 'admin'; },
		getToken: function () { return 't0k3n'; }
	};

	var mockLoginResourceNoToken = {
		getRole: function () { return ''; },
		getToken: function () { return ''; }
	};

	var mockLocation = {
		path: function (location) { }
	};

	var mockEvaluationTemplateResource = {
		create: function () {
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

	var mockEvaluationTemplateResourceError = {
		create: function () {
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
				} else {
					mockTemplate = mockEvaluationTemplateResource;
				}

				return $controller('CreateTemplateController',
				{ $scope: 					  scope,
				  $location: 	  			  mockLocation,
				  LoginResource: 			  mockLogin,
				  EvaluationTemplateResource: mockTemplate });
			};
		});

		spyOn(mockLoginResource, 'getToken').and.callThrough();
		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getToken').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockLocation, 'path');
		spyOn(toastr, 'error');
		spyOn(toastr, 'success');
		spyOn(mockEvaluationTemplateResource, 'create').and.callThrough();
		spyOn(mockEvaluationTemplateResourceError, 'create').and.callThrough();
	});

	describe('when user is not logged in', function () {
		beforeEach(function () {
			controller = createController(false, false);
		});

		it('should get token and role from resource', function () {
			expect(mockLoginResourceNoToken.getToken).toHaveBeenCalled();
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
			expect(scope.role).toEqual('');
			expect(scope.token).toEqual('');
		});

		it('should redirect user to login', function () {
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when user is logged in as admin', function() {
		beforeEach(function() {
			controller = createController(true, false);
		});

		it('should initialize all string variables on scope', function () {
			expect(scope.title).toEqual('');
			expect(scope.titleEN).toEqual('');
			expect(scope.intro).toEqual('');
			expect(scope.introEN).toEqual('');
			expect(scope.qText).toEqual('');
			expect(scope.qTextEN).toEqual('');
			expect(scope.qImageURL).toEqual('');
		});

		it('should initialize questions as empty arrays', function () {
			expect(scope.courseQuestions.length).toEqual(0);
			expect(scope.teacherQuestions.length).toEqual(0);
		});

		// perhaps add more tests, will probably not be needed
	});

	describe('resetQuestion', function () {
		beforeEach(function () {
			controller = createController(true, false);
			scope.qText = 'texti';
			scope.qTextEN = 'text';
			scope.qImageURL = 'some url';
			scope.qImageURL = 'some url';
			scope.qTypeOption = [];
			scope.qType = 'single';
			scope.optionRelate = [];
			scope.relate = 'Teachers';
			scope.answers = [
			{
				Text: 'Ertu í bullinu?',
				TextEN: 'Are you red bull?',
				ImageURL: 'urlz',
				Weight: 1
			},
			{
				Text: 'Ertu nettur?',
				TextEN: 'Are you featherweight?',
				ImageURL: 'urlzSomeMoreBits',
				Weight: 2
			}];
		});

		it('should reset all scope variables regarding question', function () {
			scope.resetQuestion();
			expect(scope.qText).toEqual('');
			expect(scope.qTextEN).toEqual('');
			expect(scope.qImageURL).toEqual('');
			expect(scope.qTypeOption).toEqual([ {opt: 'text'}, {opt: 'single'}, {opt: 'multiple'} ]);
			expect(scope.qType).toEqual(scope.qTypeOption[0]);
			expect(scope.optionRelate).toEqual([ {to:'Courses'}, {to:'Teachers'}, {to:'Course & Teachers'} ]);
			expect(scope.relate).toEqual(scope.optionRelate[0]);
			expect(scope.answers).toEqual([{
				Text: '',
				TextEN: '',
				ImageURL: '',
				Weight: 1
			}]);
		});
	});

	describe('createTemplate', function () {
		beforeEach(function () {
			controller = createController(true, false);
		});

		it('should not create a template with no questions, and alert user with toastr', function () {
			scope.createTemplate();
			expect(toastr.error).toHaveBeenCalledWith('You need to add at least one question');
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
		});

		it('should call create in EvaluationTemplateResource with templateObj', function () {
			scope.title = 'titill';
			scope.titleEN = 'title';
			scope.intro = 'inngangur';
			scope.introEN = 'introduction';
			scope.courseQuestions = [{
				Text: 'spurning',
				TextEN: 'question',
				ImageURL: 'urlz',
				Type: 'text'
			}];
			scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).toHaveBeenCalled();
			expect(toastr.success).toHaveBeenCalledWith('Created evaluation template');
		});
	});

	describe('createTemplate when EvaluationTemplateResource returns error', function () {
		it('should alert user', function () {
			controller = createController(true, true);
			scope.title = 'titill';
			scope.titleEN = 'title';
			scope.intro = 'inngangur';
			scope.introEN = 'introduction';
			scope.courseQuestions = [{
				Text: 'spurning',
				TextEN: 'question',
				ImageURL: 'urlz',
				Type: 'text'
			}];

			scope.createTemplate();

			expect(toastr.error).toHaveBeenCalledWith('Could not create evaluation template');
		});
	});

	describe('createQuestion', function () {
		beforeEach(function () {
			controller = createController(true, false);
			scope.qText = 'texti';
			scope.qTextEN = 'text';
			scope.qImageURL = 'urlz';
		});

		describe('text questions', function () {
			beforeEach(function () {
				scope.qType.opt = 'text';
			});

			it('should add question related to courses to courseQuestions', function () {
				scope.relate.to = 'Courses';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to Courses');
			});

			it('should add question related to teachers to teacherQuestions', function () {
				scope.relate.to = 'Teachers';
				scope.createQuestion();
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to teachers');
			});

			it('should add question related to courses and teachers to both arrays', function () {
				scope.relate.to = 'Courses & Teachers';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to courses and teachers');
			});
		});

		describe('single choice questions', function () {
			beforeEach(function () {
				scope.qType.opt = 'single';
			});

			it('should add question related to courses to courseQuestions', function () {
				scope.relate.to = 'Courses';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to Courses');
			});

			it('should add question related to teachers to teacherQuestions', function () {
				scope.relate.to = 'Teachers';
				scope.createQuestion();
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to teachers');
			});

			it('should add question related to courses and teachers to both arrays', function () {
				scope.relate.to = 'Courses & Teachers';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to courses and teachers');
			});
		});

		describe('multiple choice questions', function () {
			beforeEach(function () {
				scope.qType.opt = 'multiple';
			});

			it('should add question related to courses to courseQuestions', function () {
				scope.relate.to = 'Courses';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to Courses');
			});

			it('should add question related to teachers to teacherQuestions', function () {
				scope.relate.to = 'Teachers';
				scope.createQuestion();
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to teachers');
			});

			it('should add question related to courses and teachers to both arrays', function () {
				scope.relate.to = 'Courses & Teachers';
				scope.createQuestion();
				expect(scope.courseQuestions.length).toEqual(1);
				expect(scope.teacherQuestions.length).toEqual(1);
				expect(toastr.success).toHaveBeenCalledWith('Added question to courses and teachers');
			});
		});
	});

	describe('addAnswer', function () {
		beforeEach(function () {
			controller = createController(true, false);
		});

		it('should add an empty answer to answers array when addAnswer(add) is called', function () {
			expect(scope.answers.length).toEqual(1);
			scope.addAnswer('add');
			expect(scope.answers.length).toEqual(2);
		});

		it('should remove an answer from answers array when addAnswer(delete) is called', function () {
			scope.addAnswer('delete');
			expect(scope.answers.length).toEqual(0);
		});
	});
});