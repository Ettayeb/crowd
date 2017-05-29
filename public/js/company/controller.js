// public/js/controllers/BackendCtrl.js
angular.module('CompanyCtrl', [])

// controllers are here

.controller('OeditController', function(companyAuth, frontend, $routeParams, common, Upload, $location) {

  var vm = this;
  vm.alerts = [];
  frontend.singleoffer($routeParams.id).then(function onSuccess(resp) {
    vm.formData = resp.data;
    vm.formData.ended_at = new Date(vm.formData.ended_at);
  }, function onError(resp) {
    vm.alerts.push({
      type: "danger",
      msg: "There is a problem loading your data.. Please contact the webmaster"
    });
  });

  vm.options = {
    language: 'en',
    allowedContent: true,
    entities: false
  };
  vm.popup = {
    opened: false
  };
  vm.datepickerOptions = {
    format: 'yyyy-mm-dd',
  };
  vm.open = function() {
    vm.popup.opened = true;
  };


  vm.submit = function() {
    Upload.upload({
      url: '/api/offer/' + vm.formData._id,
      method: 'PUT',
      data: vm.formData,
      headers: {
        'Authorization': 'Bearer ' + companyAuth.getToken()
      }, // only for html5
    }).then(function(resp) {
      vm.alerts.push({
        type: "success",
        msg: "Your data changed with success"
      });
    }, function(resp) {
      vm.alerts.push({
        type: "danger",
        msg: "There is a problem loading your data.. Please contact the webmaster"
      });
    });

  };







}).controller('SeditController', function(companyAuth, frontend, $routeParams, common, Upload, $location) {

  var vm = this;

  vm.alerts = [];
  frontend.singleoffer($routeParams.id).then(function onSuccess(resp) {
    vm.formData = resp.data;
    vm.choices = vm.formData.nested;
    vm.formData.ended_at = new Date(vm.formData.ended_at);
  }, function onError(resp) {
    vm.alerts.push({
      type: "danger",
      msg: "There is a problem loading your data.. Please contact the webmaster"
    });
  });
  vm.addchoice = function() {

    var newItemNo = vm.choices.length + 1;
    vm.choices.push({
      'id': 'choice' + newItemNo
    });

  };



  vm.options = {
    language: 'en',
    allowedContent: true,
    entities: false
  };
  vm.popup = {
    opened: false
  };
  vm.datepickerOptions = {
    format: 'yyyy-mm-dd',
  };
  vm.open = function() {
    vm.popup.opened = true;
  };


  vm.submit = function() {
    Upload.upload({
      url: '/api/offer/' + vm.formData._id,
      method: 'PUT',
      data: vm.formData,
      headers: {
        'Authorization': 'Bearer ' + companyAuth.getToken()
      }, // only for html5
    }).then(function(resp) {
      vm.alerts.push({
        type: "success",
        msg: "Your data changed with success"
      });
    }, function(resp) {
      vm.alerts.push({
        type: "danger",
        msg: "There is a problem loading your data.. Please contact the webmaster"
      });
    });

  };







}).controller('CprofileController', function(companyAuth, common, Upload, $location) {

  var vm = this;
  vm.formData = {};
  vm.alerts = [];
  vm.closeAlert = function(index) {
    vm.alerts.splice(index, 1);
  };

  companyAuth.profile().then(function(resp) {

    vm.formData = resp.data;
    console.log(vm.formData);
  }, function(resp) {
    vm.alerts.push({
      type: "danger",
      msg: "There is a problem loading your data.. Please contact the webmaster"
    });
  });


  common.countries().then(function(response) {
    vm.countries = response.data;
  });

  vm.submit = function() {
    if (vm.formData.password != vm.formData.password_confirm) vm.alerts.push({
      type: "danger",
      msg: "Verify your password please"
    });
    if (Object.keys(vm.formData).length == 0) {
      return vm.alerts.push({
        type: "warning",
        msg: "No changes done"
      });
    }
    console.log(vm.formData);
    Upload.upload({
      url: '/api/company/profile',
      data: vm.formData,
      headers: {
        'Authorization': 'Bearer ' + companyAuth.getToken()
      }, // only for html5
    }).then(function(resp) {
      vm.alerts.push({
        type: "success",
        msg: "Your data changed with success"
      });
    }, function(resp) {
      vm.alerts.push({
        type: "danger",
        msg: "There is a problem loading your data.. Please contact the webmaster"
      });
    });


  };

}).controller('ClogController', function(companyAuth, $location) {

  var vm = this;


  vm.submit = function() {

    var company = vm.formData;
    companyAuth.login(company).then(function onSuccess(response) {
      console.log(response.data.token);
      companyAuth.saveToken(response.data.token);
      $location.path('/company');
    }, function onError(response) {
      vm.error = response.data.message;
      console.log(vm.error);
    });

  };

}).controller('CindController', function(companyAuth, $route) {
  var vm = this;
  vm.alerts = [];
  companyAuth.getoffers().then(function onSuccess(response) {
    vm.offers = response.data;
    console.log(vm.offers);
    vm.currentPage = 1; // keeps track of the current page
    vm.pageSize = 2; // holds the number of items per page
  }, function onError(response) {
    vm.error = response.data.message;
  });
  companyAuth.getserveys().then(function onSuccess(response) {
    vm.serveys = response.data;
    console.log(vm.serveys);
    vm.currentPageS = 1; // keeps track of the current page
    vm.pageSizeS = 2; // holds the number of items per page
  }, function onError(response) {
    vm.error = response.data.message;
  });

  vm.remove = function(id) {
    companyAuth.deleteoffer(id).then(function(resp) {
      vm.alerts.push({
        type: "success",
        msg: "Votre offre a été supprimé avec succés"
      });
      $route.reload();
    }, function(resp) {
      vm.alerts.push({
        type: "danger",
        msg: "There is a problem loading your data.. Please contact the webmaster"
      });
    });


  };

}).controller('CregController', function(companyAuth, $location) {

  this.formData = {};

  this.submit = function() {
    var company = this.formData;
    console.log(company.email);
    if (company.password != company.password_verif) {
      this.error = "password not the same";
      console.log(this.error);

    } else if (company.password.length < 6) {
      this.error = "Password must be more than 6 caracters";
      console.log(this.error);

    } else {
      // call the auth.. factory then it will do the job
      companyAuth.register(company).then(function onSuccess(resp) {
        companyAuth.saveToken(resp.data.token);
        // any redirection or what you want to add here after the register
        $location.path("/");
      }, function onError(resp) {
        vm.error = resp.data.message;
      });
    }

  };

}).controller('OaddController', function(Upload, companyAuth, $location, $scope) {

  var vm = this;
  vm.formData = {};
  vm.formData.type = "";
  vm.formData._company = companyAuth.currentCompany().id;
  vm.options = {
    language: 'en',
    allowedContent: true,
    entities: false
  };
  vm.popup = {
    opened: false
  };
  vm.datepickerOptions = {
    format: 'yyyy-mm-dd',
  };
  vm.open = function() {
    vm.popup.opened = true;
  };



  vm.submit = function() {
    Upload.upload({
      url: '/api/offer',
      data: vm.formData,
      headers: {
        'Authorization': 'Bearer ' + companyAuth.getToken()
      }, // only for html5
    }).then(function(resp) {
      console.log('Success ');
      $location.path('/company/');
    }, function(resp) {
      console.log('Error status: ');
    }, function(evt) {
      progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });

  };



}).controller('SaddController', function(Upload, companyAuth, $location) {

  var vm = this;
  vm.formData = {};
  vm.formData.choice = [];
  vm.choices = [];
  vm.formData.type = "";
  vm.formData._company = companyAuth.currentCompany().id;
  vm.options = {
    language: 'en',
    allowedContent: true,
    entities: false
  };
  vm.popup = {
    opened: false
  };
  vm.datepickerOptions = {
    format: 'yyyy-mm-dd',
  };
  vm.open = function() {
    vm.popup.opened = true;
  };

  vm.addchoice = function() {

    var newItemNo = vm.choices.length + 1;
    vm.choices.push({
      'id': 'choice' + newItemNo
    });

  };

  vm.submit = function() {

    console.log(vm.formData);
    Upload.upload({
      url: '/api/offer',
      data: vm.formData,
      headers: {
        'Authorization': 'Bearer ' + companyAuth.getToken()
      }, // only for html5
    }).then(function(resp) {
      console.log('Success ');
      $location.path('/company/');
    }, function(resp) {
      console.log('Error status: ');
    }, function(evt) {
      progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };



})

.controller('IndexCatController', function($scope, category) {

  // something beautiful will be here xD

  category.getall().error(function() {
    alert('there is something not working well !');
  }).then(function(res) {
    //console.log(res);
    $scope.categories = res.data;

  });
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
}).controller('AddArticle', function($scope, article, category, companyAuth, $location) {

  $scope.id = companyAuth.currentUser().id.toString();
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



});