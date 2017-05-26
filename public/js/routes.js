angular.module("routes", []).config(function($routeProvider, $locationProvider) {

  $routeProvider

  // home page
  .when('/', {
    templateUrl: 'views/index.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Home'
  })

  // admin registers
  .when('/user/register', {
    templateUrl: 'views/user/register.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Candidate registration'
  }).when('/company/register', {
    templateUrl: '/views/company/register.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Company registration'

  }).when('/user/', {
    templateUrl: 'views/user/index.html',
    requireUserLogin: true,
    requireCompanyLogin: false,
    title: 'Candidate Home'
  }).when('/user/profile', {
    templateUrl: 'views/user/profile.html',
    requireUserLogin: true,
    requireCompanyLogin: false,
    title: 'Candidate Profile'
  }).when('/user/login', {
    templateUrl: 'views/user/login.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Candidate Login'
  }).when('/offers', {
    templateUrl: 'views/offers.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Offers'
  })
  .when('/company/login', {
    templateUrl: '/views/company/login.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Company Login'
  }).when('/company/profile', {
    templateUrl: 'views/company/profile.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'Candidate Profile'
  }).when('/company/', {
    templateUrl: '/views/company/index.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'Company Home'
  }).when('/company/offer/add', {
    templateUrl: '/views/company/offer/add.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'Add Offer'
  })
  .when('/company/servey/add', {
    templateUrl: '/views/company/offer/addservey.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'Add Servey'
  })
  .when('/company/offer/:id', {
    templateUrl: '/views/offer/index.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'View Offer'
  })
.when('/company/servey/:id', {
    templateUrl: '/views/servey/index.html',
    requireUserLogin: false,
    requireCompanyLogin: true,
    title: 'View Servey'
  })
  .when('/offer/:id', {
    templateUrl: '/views/offer/index.html',
    requireUserLogin: false,
    requireCompanyLogin: false,
    title: 'Offer'
  })

  .when('/entreprise/logout', {
    controller: 'LogOutController',
    templateUrl: '/views/backend/private/logout.html',
    requireLogin: false
  }).when('/entreprise', {
    templateUrl: '/views/backend/private/index.html',
    requireLogin: true
  }).when('/entreprise/categories', {
    templateUrl: '/views/backend/private/category/index.html',
    requireLogin: true
  }).when('/entreprise/categories/add', {
    templateUrl: '/views/backend/private/category/add.html',
    controller: 'CategoryController',
    requireLogin: true
  }).when('/entreprise/categories/remove/:id', {
    templateUrl: '/views/backend/private/category/remove.html',
    requireLogin: true
  }).when('/entreprise/categories/edit/:id', {
    templateUrl: '/views/backend/private/category/edit.html',
    controller: 'EditCategory',
    requireLogin: true
  })
  // articles routes
  .when('/entreprise/articles', {
    templateUrl: '/views/backend/private/article/index.html',
    requireLogin: true
  }).when('/entreprise/articles/add', {
    templateUrl: '/views/backend/private/article/add.html',
    requireLogin: true
  }).when('/entreprise/files', {
    templateUrl: '/views/backend/private/files/index.html',
    requireLogin: true
  }).when('/entreprise/files/remove/:id', {
    templateUrl: '/views/backend/private/files/index.html',
    requireLogin: true
  })
  // .otherwise('/');    

  $locationProvider.html5Mode(true);

})
// prevent anyone not connected from entering to the admin panel

.run(function($rootScope, $location, $route, userAuth, companyAuth) {
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    if ($route.routes[$location.path()]) {
      if (($route.routes[$location.path()].requireUserLogin && !userAuth.isLoggedIn()) || ($route.routes[$location.path()].requireCompanyLogin && !companyAuth.isLoggedIn())) {
        if (current.indexOf('company') !== -1) {
          event.preventDefault();
          $location.path('/company/login');
        } else if (current.indexOf('user') !== -1) {
          event.preventDefault();
          $location.path('/user/login');
        } else {
          event.preventDefault();
          $location.path('/');

        }
      }
    }

  });

  $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute) {
    //Change page title, based on Route information
    if ($route.current) $rootScope.title = $route.current.title;
  })


}).filter('start', function() {
  return function(input, start) {
    if (!input || !input.length) {
      return;
    }

    start = +start;
    return input.slice(start);
  };
});