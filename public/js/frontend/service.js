angular.module('FrontendService', []).factory('frontend', function ($http, $window, $filter) {
    
    alloffers = function() {
      return $http.get('/api/offers') ;
    };


    singleoffer = function(id) {
      return $http.get('/api/offer/' + id) ;

    };
    apply = function(data) {
      return $http.post('/api/apply' , data) ;

    };
    getapplies = function(id) {
      return $http.get('/api/applies/' + id) ;

    };
    search = function(search){
      return $http.post('/api/searchoffer/' , { 'search' : search }) ;
    
    };
    allserveys = function() {
      return $http.get('/api/serveys') ;
    };
    counter = function() {
      return $http.get('/api/counter') ;
    };


    
    return {
      alloffers : alloffers,
      singleoffer : singleoffer,
      apply : apply,
      getapplies : getapplies,
      search : search,
      allserveys : allserveys,
      counter : counter

      };
 

});
// stopped here

