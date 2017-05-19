// public/js/controllers/BackendCtrl.js
angular.module('UserCtrl', [])

// controllers are here

.controller('UlogController', function(userAuth, $location) {

  var vm = this;
  vm.submit = function() {
    user = this.formData;
    userAuth.login(user).then(function onSuccess(success) {
      userAuth.saveToken(success.data.token);
      $location.path('/user');
    }, function onError(error) {
      // debug
      vm.error = error.data.message;
      console.log(error.data.message);

    }

    );
  };
}).controller('LogOutController', function($scope, userAuth, $location) {


  userAuth.logout();
  $location.path('/backend/login');
}).controller('IndexController', function($scope) {

  $scope.tagline = 'This is the backend !';


}).controller('UindController', function(userAuth) {
  var vm = this;
  userAuth.getapplies().then(function onSuccess(response) {
    vm.applies = response.data;
    console.log(vm.applies);
    vm.currentPage = 1; // keeps track of the current page
    vm.pageSize = 2; // holds the number of items per page
  }, function onError(response) {
    vm.error = response.data.message;
    console.log(vm.error);
  })
})
  .controller('UregController', function(userAuth, $location) {
    var vm = this;
    vm.formData = {};

    vm.submit = function() {
      var user = this.formData;
      console.log(user.email);
      if (user.password != user.password_verif) {
        vm.error = "Verify your password bro !";
        console.log(this.error);

      } else if (user.password.length < 6) {
        vm.error = "Password must be more than 6 caracters";
        console.log(this.error);

      } else {
        // call the auth.. factory then it will do the job
        userAuth.register(user).then(function onSuccess(response) {
          console.log(response);
          userAuth.saveToken(response.token);
          console.log("Successfully Registered ! go write some good articles bro please :3");
          $location.path("/");


        }, function onError(response) {
          vm.error = response.data.message;
          console.log(response.data.message);
        });


      }

    };

  }).controller('RemoveCategory', function($scope, $routeParams, category, $location) {

    $scope.remove = function() {
      id = $routeParams.id;
      //debug
      console.log('id= ' + id);
      category.remove(id).error(function(err) {
        //debug
        console.log(err);
        $scope.error = err.message;
      }).then(function(res) {
        //debug
        console.log(res);
        $scope.success = res.data.message;
        $location.path('/backend/categories/');
      });
    };
    $scope.cancel = function() {
      $location.path('/backend/categories');
    };
  }).controller('EditCategory', function($scope, category, $routeParams, $location) {

    category.get($routeParams.id).error(function(err) {
      //debug
      console.log(err);

    }).then(function(res) {
      //debug
      console.log(res);
      $scope.category = res.data;

    });

    $scope.update = function() {
      var c = $scope.category;
      console.log(c);
      category.update(c).error(function(err) {
        //debug
        $scope.error = err.message;

      }).then(function(res) {
        //debug
        $scope.success = res.data.message;
      });

    };



  })
  // article controllers
  .controller('IndexArtController', function($scope, article) {

    article.getall().error(function(err) {
      $scope.error = err.data.message;
    }).then(function(res) {
      //debug
      console.log(res);
      $scope.articles = res.data;
    });
  }).controller('AddArticle', function($scope, article, category, userAuth, $location) {

    $scope.id = userAuth.currentUser().id.toString();
    console.log($scope.id);
    $scope.submit = function() {
      console.log($scope.article);
      article.add($scope.article).error(function(err) {
        //debug
        console.log(err);
        $scope.error = err.data.message;
      }).then(function(res) {
        //debug
        console.log(res);
        $scope.success = res.data.message;
        $location.path('/backend/articles');

      });

    };

    category.getall().then(function(res) {
      $scope.categories = res.data;
    });



  }).controller('UploadFile', function($scope, File, $window) {
    //debug

    var vm = this;
    vm.submit = function() { //function to call on form submit
      if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
        vm.upload(vm.file); //call upload function
      }
    };
    vm.upload = function(file) {
      File.upload(file).then(function(resp) { //upload function returns a promise
        if (resp.data.error_code === 0) { //validate success
          vm.success = 'File ' + resp.config.data.file.name + ' uploaded with success !';
          $window.location.reload();
        } else {
          vm.error = 'an error occured';
        }
      }, function(resp) { //catch error
        console.log('Error status: ' + resp.status);
        $window.alert('Error status: ' + resp.status);
      }, function(evt) {
        console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      });
    };
  }).controller('Files', function($scope, File) {
    //debug
    File.getfiles().error(function() {
      $scope.error = 'there is a problem with getting files';
    }).then(function(res) {
      $scope.files = res.data;

    });


  }).controller('RemoveFile', function($scope, File, $routeParams, $location) {
    //debug
    File.remove($routeParams.id).error(function() {
      $scope.error = 'there is a problem with removing this file';
    }).then(function(res) {
      //
      $scope.success = res.data.message;
      $location.path('/backend/files');

    });


  });