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
        
    
    return {
      alloffers : alloffers,
      singleoffer : singleoffer,
      apply : apply,
      getapplies : getapplies


      
      };
 

});
// stopped here

