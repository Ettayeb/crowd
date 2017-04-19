angular.module("routes", []).config( function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/frontend/home.html',
            controller: 'HomeController',
            requireLogin : false

        })

        // admin registers
        .when('/backend/register', {
            templateUrl: '/views/backend/private/register.html',
            controller: 'RegisterController',
            requireLogin: false
        })
        .when('/entreprise/login', {
            templateUrl: '/views/backend/login.html',
            controller: 'LoginController',
            requireLogin: false
        })        
        .when('/entreprise/logout', {
            controller: 'LogOutController',
            templateUrl: '/views/backend/private/logout.html',            
            requireLogin: false
        })        
        .when('/entreprise', {
            templateUrl: '/views/backend/private/index.html',
            controller: 'IndexController',
            requireLogin: true
        })        
        .when('/entreprise/categories', {
            templateUrl: '/views/backend/private/category/index.html',
            requireLogin: true
        })        
        .when('/entreprise/categories/add', {
            templateUrl: '/views/backend/private/category/add.html',
            controller: 'CategoryController',
            requireLogin: true
        })        
        .when('/entreprise/categories/remove/:id', {
            templateUrl: '/views/backend/private/category/remove.html',
            controller: 'RemoveCategory',
            requireLogin: true
        })        
        .when('/entreprise/categories/edit/:id', {
            templateUrl: '/views/backend/private/category/edit.html',
            controller: 'EditCategory',
            requireLogin: true
        })
        // articles routes
        .when('/entreprise/articles', {
            templateUrl: '/views/backend/private/article/index.html',
            controller: 'IndexArtController',
            requireLogin: true
        })
        .when('/entreprise/articles/add', {
            templateUrl: '/views/backend/private/article/add.html',
            controller: 'AddArticle',
            requireLogin: true
        })
        .when('/entreprise/files', {
            templateUrl: '/views/backend/private/files/index.html',
            requireLogin: true
        })
        .when('/entreprise/files/remove/:id', {
            templateUrl: '/views/backend/private/files/index.html',
            controller : 'RemoveFile' ,
            requireLogin: true
        })
        .otherwise('/');

        


        
        
    $locationProvider.html5Mode(true);

}])
    // prevent anyone not connected from entering to the admin panel

    .run(function($rootScope, $location , $route , authentication) {
        $rootScope.$on( "$locationChangeStart", function(event, next, current) {
            if ( $route.routes[$location.path()].requireLogin  && !authentication.isLoggedIn() )
            {
                event.preventDefault();
                $location.path('/backend/login');
                    
            }
    
        });
});