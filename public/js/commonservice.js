angular.module('CommonService', []).factory('common', function($http, $window, $filter) {
  countries = function() {
    return $http.get('/js/countries.json');
  };
  vote = function(id) {
    return $http.get('/api/vote/' + id);
  };

  svote = function(sid , cid) {
    return $http.get('/api/vote/' + sid + '/' + cid);
  };



  return {
    countries: countries,
    vote : vote,
    svote : svote
  };
});
// stopped here