// public/js/controllers/BackendCtrl.js
angular.module('FrontendCtrl', [])

// controllers are here


.controller('navCtrl', function(frontend, $window , $location, userAuth, companyAuth) {

  var vm = this;
  vm.userloggedin = userAuth.isLoggedIn();
  vm.companyloggedin = companyAuth.isLoggedIn();

  vm.companylogout = function() {

    companyAuth.logout();
    $location.path('/');
    $window.location.reload();    

  };

  vm.userlogout = function() {

    userAuth.logout();
    $location.path('/');
    $window.location.reload();    

  };



})
.controller('ServeyindController', function(frontend, $location , $window) {

  var vm = this;
  vm.loaded = false;
  vm.newdate = new Date();
  vm.Math = $window.Math;
  frontend.allserveys().then(function onSuccess(response) {
    vm.serveys = response.data;
    vm.currentPage = 1; // keeps track of the current page
    vm.pageSize = 8; // holds the number of items per page
    vm.loaded = true;


  },

  function onError(response) {
    vm.error = response.data.message;
  });
  
  vm.percentage = function(end , start){
        today = new Date();
        e = new Date(end);
        s = new Date(start);
        p = Math.round(((today - s) / (e - s)) * 100);
        return p;
  };
  
vm.submit = function(){
    console.log(vm.search);
  if (vm.search !== undefined) {
    frontend.search(vm.search)
    .then(function onSuccess(resp){
      vm.serveys = resp.data;
      
    }, function onError(){
      
      });
  }
};
})
.controller('SindController', function(frontend, $location , $window) {

  var vm = this;
  vm.loaded = false;
  vm.newdate = new Date();
  vm.Math = $window.Math;
  frontend.alloffers().then(function onSuccess(response) {
    vm.offers = response.data;
    vm.currentPage = 1; // keeps track of the current page
    vm.pageSize = 8; // holds the number of items per page
    vm.loaded = true;


  },

  function onError(response) {
    vm.error = response.data.message;
  });
  
  vm.percentage = function(end , start){
        today = new Date();
        e = new Date(end);
        s = new Date(start);
        p = Math.round(((today - s) / (e - s)) * 100);
        return p;
  };
  
vm.submit = function(){
    console.log(vm.search);
  if (vm.search !== undefined) {
    frontend.search(vm.search)
    .then(function onSuccess(resp){
      vm.offers = resp.data;
      
    }, function onError(){
      
      });
    
  }
  
};



})

.controller('FindController', function(frontend, $location) {

  var vm = this;
  vm.loaded = false;

  vm.slides = [];
  var currIndex = 0;
  vm.myInterval = 5000;
  vm.noWrapSlides = false;
  vm.active = 0;
  vm.slides.push({
    image: '/images/slide1.jpg',
    id: currIndex++,
    MainText: 'Bienvenue sur le plus grand terrain de jeu créatif !',
    SubText: 'Khedmti est une communauté mondiale de créateurs talentueux qui aiment résoudre les défis de marques grâce à des idées créatives et du contenu de qualité.'
  });

    vm.percentage = function(end , start){
        today = new Date();
        e = new Date(end);
        s = new Date(start);
        p = Math.round(((today - s) / (e - s)) * 100);
        return p;
  };

  
  frontend.alloffers().then(function onSuccess(response) {
    vm.offers = response.data;
    vm.currentPage = 1; // keeps track of the current page
    vm.pageSize = 8; // holds the number of items per page
    vm.loaded = true;


  },

  function onError(response) {
    vm.error = response.data.message;
  });

  frontend.counter("offers")
.then(function onSuccess(response) {
    vm.coffers = response.data;

  },

  function onError(response) {
  });
  frontend.counter("companies")
.then(function onSuccess(response) {
    vm.ccompanies = response.data;

  },

  function onError(response) {
  });
  frontend.counter("candidates")
.then(function onSuccess(response) {
    vm.ccandidates = response.data;

  },

  function onError(response) {
  });

  
  



}).controller('OindController', function(frontend, common , userAuth, $routeParams, $location, $uibModal) {

  var vm = this;
  vm.app = 0 ;
  vm.alerts = [];
  vm.closeAlert = function(index) {
    vm.alerts.splice(index, 1);
  };

  vm.userloggedin = userAuth.isLoggedIn();
  console.log(vm.userloggedin);
  if (vm.userloggedin) {
    userAuth.applied(userAuth.currentUser().id).then(function onSuccess(response) {

      if (response.data){
        console.log("aaaaaaaaaaaa");
      vm.app = 1;
      }
      else {
        console.log("aaaaaaaaaaaddddddddd");

        vm.app = 0;
      }
    },

    function onError() {

      vm.app = 0;
    });
  }
      console.log(vm.app);

  frontend.singleoffer($routeParams.id).then(function onSuccess(response) {
    vm.offer = response.data;
    vm.file = "/uploads/" + vm.offer.file;
    vm.loaded = true;
    console.log(vm.file);
    if (vm.offer.type == 'Postulation-Vote') {
      frontend.getapplies($routeParams.id).then(function onSuccess(response) {
        vm.applies = response.data;
        //console.log(vm.applies);              
        vm.currentPage = 1; // keeps track of the current page
        vm.pageSize = 2; // holds the number of items per page

      }, function onError(response) {
        vm.alerts.push({
          type: "warning",
          msg: response.data.message
        });
      });
    }
  },

  function onError(response) {
    vm.alerts.push({
      type: "warning",
      msg: response.data.message
    });
  });

  vm.open = function(size) {
    vm.data = {
      userid: userAuth.currentUser().id,
      offerid: vm.offer._id
    };
    console.log(vm.data);
    modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modals/applymodal.html',
      controller: 'ApplyCtrl',
      controllerAs: 'vm',
      size: size,
      resolve: {
        items: function() {
          return vm.data;
        }
      }
    });

    modalInstance.result.then(function(alert) {
      vm.alerts.push({
        type: alert.type,
        msg: alert.message
      });
    }, function() {
      console.log('modal-component dismissed at: ' + new Date());
    });


  };

  vm.vote = function(applyid){
  common.vote(applyid).then(function onSuccess(resp){
      frontend.getapplies($routeParams.id).then(function onSuccess(response) {
        vm.applies = response.data;
        //console.log(vm.applies);              
        vm.currentPage = 1; // keeps track of the current page
        vm.pageSize = 2; // holds the number of items per page

      }, function onError(response) {
        vm.alerts.push({
          type: "warning",
          msg: response.data.message
        });
      });
    
    
    },function onError(resp){
    console.log("ERROORR VOTE");
    
    });
    
  };
  
  

})

.controller('SSindController', function(frontend, common , userAuth, $routeParams, $location, $uibModal) {

  var vm = this;
  vm.app = 0 ;
  vm.alerts = [];
  vm.closeAlert = function(index) {
    vm.alerts.splice(index, 1);
  };

vm.get = function() {
  frontend.singleoffer($routeParams.id).then(function onSuccess(response) {
    vm.servey = response.data;
    vm.file = "/uploads/" + vm.servey.file;
    vm.loaded = true;
    console.log(vm.servey);
  },

  function onError(response) {
    vm.alerts.push({
      type: "warning",
      msg: response.data.message
    });
  });
};

  vm.get();

  vm.vote = function(sid,cid){
  common.svote(sid,cid).then(function onSuccess(resp){

    vm.get();
  
      }, function onError(response) {
        vm.alerts.push({
          type: "warning",
          msg: response.data.message
        });
      });
    
        
  };
  

})

.controller('ApplyCtrl', function($uibModalInstance, items, frontend, Upload) {

  var vm = this;
  vm.data = items;

  console.log(vm.data);
  vm.submit = function() {
    vm.data.file = vm.formData.file;
    Upload.upload({
      url: '/api/apply',
      data: vm.data,
    }).then(function onSuccess(resp) {
      message = {
        type: 'success',
        message: resp.data.message
      };
      $uibModalInstance.close(message);
    }, function onError(resp) {
      message = {
        type: 'warning',
        message: resp.data.message
      };
      $uibModalInstance.close(message);

    });
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };


}).controller('OaddController', function(Upload, companyAuth, $location) {
  var vm = this;
  // something beautiful will be here xD
  vm.formData = {};
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



}).controller('IndexCatController', function($scope, category) {

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