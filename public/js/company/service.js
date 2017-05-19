angular.module('CompanyService', []).factory('companyAuth', function($http, $window, $filter) {

  var saveToken = function(token) {
    $window.localStorage['company-token'] = token;
  };

  var getToken = function() {
    //debug
    //  console.log(' token = '+ $window.localStorage['mean-token']); // working like the sharm :D
    return $window.localStorage['company-token'];
  };
  var isLoggedIn = function() {
    var token = getToken();
    var payload;
    if (token) {
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
  currentCompany = function() {
    if (isLoggedIn()) {
      var token = getToken();
      var payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);
      return {
        id: payload._id,
        email: payload.email,
        name: payload.name

      };
    }
  };

  logout = function() {
    $window.localStorage.removeItem('company-token');
  };

  register = function(company) {
    return $http.post('/api/company', company);
  };

  login = function(company) {
    return $http.post('/api/companylogin', company);

  };

  profile = function() {
    return $http.get('/api/company/profile/' + currentCompany().id, {
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    });
  };


  getoffers = function() {
    return $http.get('/api/privateoffers', {
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    });
  };



  return {
    currentCompany: currentCompany,
    saveToken: saveToken,
    getToken: getToken,
    isLoggedIn: isLoggedIn,
    logout: logout,
    register: register,
    login: login,
    getoffers: getoffers,
    profile: profile

  };


});
// stopped here