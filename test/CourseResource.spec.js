describe('CourseResource', function () {
	var $httpBackend, factory;
	var SERVER_URL = 'http://dispatch.ru.is/h22/api/v1/';

	var course = {
			ID: 1,
			CourseID: 1,
			Name: 'Vefforritun',
			NameEN: 'Web Programming'
	};
	var evaluation = {
		ID: 1,
		TemplateID: 1,
		Title: 'Kennslumat',
		TitleEN: 'Evaluation'
	};

	describe('Server functions', function () {
		beforeEach(function () {
			module('EvalApp');

			inject(function ($injector) {
				factory = $injector.get('CourseResource');
				$httpBackend = $injector.get('$httpBackend');
			});
		});

		afterEach(function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		});
		it('should get teachers from server when getTeachers is called', function () {
			factory.init('t0k3n', course);
			factory.getTeachers('Vefforritun', 1);
			$httpBackend.expectGET(SERVER_URL + 'courses/Vefforritun/1/teachers',
			{ 'Authorization': 'Basic t0k3n',
			  'Accept': 'application/json, text/plain, */*' })
			.respond(200, []);
		});

		it('should get evaluations from server when getEvaluations is called', function () {
			factory.init('t0k3n', course);
			factory.getEvaluation('Vefforritun', 1, 1);
			$httpBackend.expectGET(SERVER_URL + 'courses/Vefforritun/1/evaluations/1',
			{ 'Authorization': 'Basic t0k3n',
			  'Accept': 'application/json, text/plain, */*' })
			.respond(200, []);
		});

		it('should post an evaluation to the server when saveEvaluation is called', function () {
			factory.init('t0k3n', course);
			factory.saveEvaluation('Vefforritun', 1, 1, evaluation);
			$httpBackend.expectPOST(SERVER_URL + 'courses/Vefforritun/1/evaluations/1',
			{ 'headers': {'Authorization': 'Basic t0k3n'}},
			{ 'Accept': 'application/json, text/plain, */*',
		      'Content-Type': 'application/json;charset=utf-8'}, evaluation)
			.respond(200);
		});
	});

	it('should return correct course', function () {
		factory.init('t0k3n', course);
		var result = factory.getCurrentCourse();
		expect(result).toEqual(course);
	});

	it('should return correct course after it is changed', function () {
		factory.init('t0k3n', course);
		var newCourse = {
			ID: 2,
			CourseID: 2,
			Name: 'Gervigreind',
			NameEN: 'Artificial Intelligence'
		};
		factory.setCurrentCourse(newCourse);
		var result = factory.getCurrentCourse();
		expect(result).toEqual(newCourse);
	});
});