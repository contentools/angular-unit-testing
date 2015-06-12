(function() {


	function TranslateServiceFactory($http) {
		var ENDPOINT = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

		/**
		 * @param {String} key 			The API key to use
		 */
		function setAPIKey(api) {
			TranslateService.API_KEY = api;
		}

		/**
		 * @param {String[]} languages	A string pair with the "from" and "to" languages
		 * @param {String} text 		The text to translate
		 */
		function translate(languages, text) {
			var config = {};

			var lang = languages.join('-');
			var params = {
				text: text,
				key: TranslateService.API_KEY,
				lang: lang
			};

			config.params = params;

			return $http.get(ENDPOINT, config).then(function(response) {
				var result = response.data;
				return result && result.text && result.text[0] || '';
			});
		}

		var TranslateService = {
			setAPIKey: setAPIKey,
			translate: translate
		};

		return TranslateService;

	}

	$module.service('TranslateService', TranslateServiceFactory);

})();
