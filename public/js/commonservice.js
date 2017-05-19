angular.module('CommonService', []).factory('common', function($http, $window, $filter) {
  countries = function() {
    return $http.get('/js/countries.json');
  };
  return {
    countries: countries
  };
});
// stopped here