angular.module('UserService', []).factory('userAuth', function ($http, $window, $filter) {

    var saveToken = function (token) {
      $window.localStorage['user-token'] = token;
    };

    var getToken = function () {
      //debug
    //  console.log(' token = '+ $window.localStorage['mean-token']); // working like the sharm :D
      return $window.localStorage['user-token'];
    };
    var isLoggedIn = function() {
      var token = getToken();
      var payload;
    
      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        //debug
       // console.log($filter('date')(payload.exp * 1000, "dd/MM/yyyy") + " ,,, " + $filter('date')(Date.now()  , 'dd/MM/yyyy')); // working like the fucking sharm ! :S
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
     currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          id : payload._id,
          email : payload.email,
          name : payload.name
        };
      }
    };

    logout = function() {
      $window.localStorage.removeItem('user-token');
    };

    register = function(user) {
      return $http.post('/api/user', user) ;
    };

    login = function(user) {
      return $http.post('/api/userlogin', user);

    };

    getall = function() {
      return $http.get('/api/users').success(function(data) {
        //debug
        console.log(data);
      });
    };
    applied = function(id) {
      return $http.get('/api/applied/' + id) ;
      
    };
    
    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      logout : logout,
      register : register,
      login : login,
      applied : applied
      
      };
 

});
// stopped here

