describe('EvaluationResource', function () {
	var $httpBackend, factory;
	var SERVER_URL = 'http://dispatch.ru.is/h22/api/v1/';
	var evaluation = {
		ID: 1,
		TemplateTitle: 'Könnun',
		TemplateTitleEN: 'Survey'
	};

	beforeEach(function () {
		module('EvalApp');

		inject(function ($injector) {
			factory = $injector.get('EvaluationResource');
		});

		factory.init('t0k3n');
	});

	describe('Server functions', function () {
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

		it('should get evaluations from server when getEvaluations is called', function () {
			factory.getEvaluations();
			$httpBackend.expectGET(SERVER_URL + 'evaluations',
			{ 'Authorization': 'Basic t0k3n',
			  'Accept': 'application/json, text/plain, */*' })
			.respond(200, []);
		});

		it('should get evaluation from server when getEvaluation is called', function () {
			factory.getEvaluation(1);
			$httpBackend.expectGET(SERVER_URL + 'evaluations/1',
			{ 'Authorization': 'Basic t0k3n',
		  	  'Accept': 'application/json, text/plain, */*' })
			.respond(200, []);
		});

		it('should post new evaluation to server when createEvaluation is called', function () {
			factory.createEvaluation(evaluation);
			$httpBackend.expectPOST(SERVER_URL + 'evaluations', evaluation, 
			{ 'Authorization': 'Basic t0k3n',
		 	  'Accept': 'application/json, text/plain, */*',
		 	  'Content-Type': 'application/json;charset=utf-8'})
			.respond(200);
		});
	});

	describe('set and getEvaluation', function () {
		it('should return correct evaluation', function () {
			factory.setEvaluation(evaluation);
			var result = factory.getThisEvaluation();
			expect(result).toEqual(evaluation);
		});
	});
});