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
					if (tObj.ID !== null && tObj.Title !== '' && tObj.TitleEn !== '' && tObj.IntroText !== '' && 
						tObj.IntroTextEN !== '' && tObj.TeacherQuestions.length !== 0) {
						fn();
					}
					return {
						error: function (errorFn) {
							// call errorFn() if error
							if (tObj.tID !== null || tObj.Title === '' || tObj.TitleEn !== '' || tObj.IntroText !== '' || 
								tObj.IntroTextEN !== '' || tObj.TeacherQuestions.length !== 0) {
								errorFn();
							}
						}
					};
				}	
			};
		},
		getTemplates: function () {},
		getTemplate: function (id) {
			return {
				success: function (fn) {
					var response = {};
					if (id !== undefined) {
						response = {
							ID: id,
							Title: 'string',
							TitleEN: 'string in english',
							IntroText: 'asdfasdf',
							IntroTextEN: 'asdfasdf',
							CourseQuestions: 'object',
							TeacherQuestions: 'object'
						};
					}
					fn(response);
					return {
						error: function (errorFn) {
							if (id === undefined) { // if it is a string ?
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

			spyOn(mockEvaluationTemplateResource, 'create').and.callFake();
			spyOn(mockEvaluationTemplateResource, 'getTemplate').and.callThrough();
			spyOn(mockEvaluationTemplateResource, 'getTemplates').and.callThrough();
			spyOn(toastr, 'error');
			spyOn(toastr, 'success');

			controller = $controller('CreateTemplateController',
				{ $scope:   	$scope });
		});

		it('Should not create template when everything is empty', function () {
			$scope.tID = null;
			$scope.title = '';
			$scope.titleEN = '';
			$scope.intro = '';
			$scope.introEN = '';
			$scope.courseQuestions = [];
			$scope.teacherQuestions = [];
			$scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('Should not create template when title is empty', function () {
			$scope.tID = 1;
			$scope.title = '';
			$scope.titleEN = 'titleEN';
			$scope.intro = 'intro';
			$scope.introEN = 'introEN';
			$scope.courseQuestions = ["obj"];
			$scope.teacherQuestions = ["obj"];
			$scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('Should not create template when titleEN is empty', function () {
			$scope.tID = 1;
			$scope.title = 'title';
			$scope.titleEN = '';
			$scope.intro = 'intro';
			$scope.introEN = 'introEN';
			$scope.courseQuestions = ["obj"];
			$scope.teacherQuestions = ["obj"];
			$scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('Should not create template when intro is empty', function () {
			$scope.tID = 1;
			$scope.title = 'title';
			$scope.titleEN = 'titleEN';
			$scope.intro = '';
			$scope.introEN = 'introEN';
			$scope.courseQuestions = ["obj"];
			$scope.teacherQuestions = ["obj"];
			$scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('Should not create template when introEN is empty', function () {
			$scope.tID = 1;
			$scope.title = '';
			$scope.titleEN = 'titleEN';
			$scope.intro = 'intro';
			$scope.introEN = 'introEN';
			$scope.courseQuestions = ["obj"];
			$scope.teacherQuestions = ["obj"];
			$scope.createTemplate();
			expect(mockEvaluationTemplateResource.create).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('Should create template when courseQuestions is empty', function () {
			$scope.tID = 1;
			$scope.title = 'title';
			$scope.titleEN = 'titleEN';
			$scope.intro = 'intro';
			$scope.introEN = 'introEN';
			$scope.courseQuestions = [];
			$scope.teacherQuestions = ["obj"];
			$scope.createTemplate();
			
			var obj = {
				ID: $scope.tID,
				Title: $scope.title,
				TitleEN: $scope.titleEN,
				IntroText: $scope.intro,
				IntroTextEN: $scope.introEN,
				CourseQuestions: $scope.courseQuestions,
				TeacherQuestions: $scope.teacherQuestions
			};
			expect(mockEvaluationTemplateResource.create).toHaveBeenCalledWith(obj);
			expect(toastr.success).toHaveBeenCalled();
		});
	});
});