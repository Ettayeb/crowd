angular.module('CommonService', []).factory('common', function($http, $window, $filter) {
  countries = function() {
    return $http.get('/js/countries.json');
  };
  vote = function(id) {
    return $http.get('/api/vote/' + id);
  };



  return {
    countries: countries,
    vote : vote
  };
});
// stopped here