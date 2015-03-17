describe('EvaluationTemplateResource', function () {
	var $httpBackend, factory;
	var SERVER_URL = 'http://dispatch.ru.is/h22/api/v1/';
	var config = {
		'Authorization': 'Basic t0k3n',
		'Accept': 'application/json, text/plain, */*'
	};
	var template = {
		ID: 1,
		Title: 'Sniðmát',
		TitleEN: 'Template',
		IntroText: 'Þetta er sniðmát',
		IntroTextEN: 'This is a template',
		CourseQuestions: [],
		TeacherQuestions: []
	};

	beforeEach(function () {
		module('EvalApp');

		inject(function ($injector) {
			factory = $injector.get('EvaluationTemplateResource');
		});

		factory.init('t0k3n');
	});

	describe('Sever functions', function () {
		beforeEach(function () {
			inject(function ($injector) {
				$httpBackend = $injector.get('$httpBackend');
			});
		});

		afterEach(function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		});

		it('should get templates from server when getTemplates is called', function () {
			factory.getTemplates();
			$httpBackend.expectGET(SERVER_URL + 'evaluationtemplates', config)
			.respond(200, []);
		});

		it('should get template from server when getTemplate is called', function () {
			factory.getTemplate(1);
			$httpBackend.expectGET(SERVER_URL + 'evaluationtemplates/1', config)
			.respond(200, []);
		});

		it('should post template to server when create is called', function () {
			factory.create(template);
			$httpBackend.expectPOST(SERVER_URL + 'evaluationtemplates', template, 
			{ 'Authorization': 'Basic t0k3n',
		 	  'Accept': 'application/json, text/plain, */*',
		 	  'Content-Type': 'application/json;charset=utf-8'}).respond(200);
		});
	});

	describe('set and getThisTemplate', function () {
		it('should return correct template when changed', function () {
			factory.setTemplate(template);
			var result = factory.getThisTemplate();
			expect(result).toEqual(template);
		});
	});
});