angular.module('CommonService', []).factory('common', function ($http, $window, $filter) {

countries = function(){
  return $http.get('/libs/countries.js');  
};

 
return {
    countries : countries
    };
 
});
// stopped here

