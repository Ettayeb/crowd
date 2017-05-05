// public/js/controllers/BackendCtrl.js
angular.module('CompanyCtrl', [])

// controllers are here

.controller('ClogController', function(companyAuth , $location) {

var vm = this;

             console.log(companyAuth.currentCompany());


    vm.submit = function() {
        
        var company = vm.formData;
        companyAuth
            .login(company)
            .then(function onSuccess(response){
                console.log(response.data.token);
             companyAuth.saveToken(response.data.token);
                $location.path('/company');           
            },function onError(response){
              vm.error = response.data.message ;
              console.log(vm.error);
            });
        
        };   

})
.controller('LogOutController', function($scope , companyAuth , $location) {

        
    companyAuth
        .logout();
         $location.path('/backend/login');   
})
.controller('CindController', function(companyAuth) {
var vm = this;
companyAuth.getoffers()
        .then( function onSuccess(response){
            vm.offers = response.data.offers;
            
            },function onError(response){
            vm.error = response.data.message;
            
            } );   

})
.controller('CregController', function(companyAuth, $location) {

this.formData = {};

this.submit = function ()
    {
        var company = this.formData;
        console.log(company.email);
        if ( company.password != company.password_verif )
        {
            this.error = "password not the same" ;
        console.log(this.error);
            
        }    
        else if ( company.password.length < 6 )
        {
            this.error = "Password must be more than 6 caracters" ;
        console.log(this.error);
            
        }    

        else {
            // call the auth.. factory then it will do the job
        companyAuth
            .register(company)
            .catch(function(err){
                this.error = err.message;
                console.log("errooooooor");
            })
            .then(function(data){
                console.log(data);
                companyAuth.saveToken(data.token);
            // any redirection or what you want to add here after the register
                  console.log("Successfully Registered !") ;
                  $location.path("/");
            });
        }
        
    };

})
.controller('CategoryController', function($scope , category ) {

    // something beautiful will be here xD
    $scope.submit = function() {
        var c = $scope.category ;
        category.add(c)
            .error(function(err){
                //debug
                $scope.error = err.message;
                
            })
            .then(function(res){
                //debug
                $scope.success = res.data.message ;
            });

    };
    
})
.controller('IndexCatController', function($scope , category ) {

    // something beautiful will be here xD
    
      category.getall().error(function(){
        alert('there is something not working well !');
        })
        .then(function(res){
            //console.log(res);
         $scope.categories =  res.data ; 
            
        });
}).controller('RemoveCategory' , function($scope ,$routeParams ,category, $location){
        
   $scope.remove = function(){
    id = $routeParams.id ;
    //debug
    console.log('id= ' +id);
    category.remove(id)
    .error(function(err){
        //debug
        console.log(err);
        $scope.error = err.message;
    })
    .then(function (res){
        //debug
        console.log(res);
        $scope.success = res.data.message;
        $location.path('/backend/categories/');
    });
    };
    $scope.cancel = function(){
      $location.path('/backend/categories');  
    };
})
.controller('EditCategory' , function($scope , category ,$routeParams , $location){
    
    category.get($routeParams.id)
        .error(function(err){
        //debug
        console.log(err);
        
        })
        .then(function(res){
            //debug
            console.log(res);
            $scope.category = res.data;
            
        });
        
    $scope.update = function() {
        var c = $scope.category ;
        console.log(c);
        category.update(c)
            .error(function(err){
                //debug
                $scope.error = err.message;
                
            })
            .then(function(res){
                //debug
                $scope.success = res.data.message ;
            });

    };
    


})
// article controllers
.controller('IndexArtController' , function($scope , article ){
    
    article.getall()
        .error(function(err){
            $scope.error = err.data.message;
        })
        .then(function(res){
            //debug
            console.log(res);
           $scope.articles = res.data; 
        });
})
.controller('AddArticle' , function($scope , article , category , companyAuth , $location) {

    $scope.id = companyAuth.currentUser().id.toString();
    console.log($scope.id);
    $scope.submit = function(){
        console.log($scope.article);
        article.add($scope.article)
            .error(function(err){
                //debug
                console.log(err);
                $scope.error = err.data.message ;
            })
            .then(function(res){
               //debug
               console.log(res);
               $scope.success = res.data.message;
               $location.path('/backend/articles');
                
            });
        
    };
    
    category.getall()
    .then(function(res){
        $scope.categories =  res.data;
    });
  
  

})
.controller('UploadFile' , function($scope , File , $window ) {
    //debug
    
         var vm = this;
        vm.submit = function(){ //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        };
        vm.upload = function (file) {
            File.upload(file)
            .then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    vm.success = 'File ' + resp.config.data.file.name + ' uploaded with success !';
                    $window.location.reload() ;
                } else {
                    vm.error='an error occured';
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
})
.controller('Files' , function($scope , File) {
    //debug
    File.getfiles()
    .error(function(){
        $scope.error = 'there is a problem with getting files';
    })
    .then(function(res){
       $scope.files = res.data;
        
    });


})
.controller('RemoveFile' , function($scope , File , $routeParams , $location) {
    //debug
    File.remove($routeParams.id)
    .error(function(){
        $scope.error = 'there is a problem with removing this file';
    })
    .then(function(res){
        //
        $scope.success = res.data.message;
       $location.path('/backend/files');
        
    });


});

