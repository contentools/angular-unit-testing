/**
 * Translate Service
 */
describe('TranslateService', function() {
	beforeEach(module('app'));

	describe('#setAPIKey(key)', function() {
		it('should save the API key to use in the requests', inject(function(TranslateService) {
			TranslateService.setAPIKey('foo');
			expect(TranslateService.API_KEY).toBe('foo');
		}));
	});

	describe('#translate(languages, text)', function() {
		it('should call the translation API endpoint and return a Promise', inject(function($httpBackend, TranslateService) {
			var key = 'bar',
				text = 'sports',
				lang = 'en-pt';

			TranslateService.setAPIKey(key);
			var URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&lang=' + lang + '&text=' + text;

			$httpBackend.expectGET(URL).respond({
				code: 200,
				lang: 'en-pt',
				text: [
					'esportes'
				]
			});

			var response = TranslateService.translate(['en', 'pt'], text);
			var result;

			response.then(function(translatedText) {
				result = translatedText;
			});

			$httpBackend.flush();

			expect(result).toBe('esportes');
		}));
	});
});
