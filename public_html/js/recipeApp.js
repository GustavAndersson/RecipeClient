var module = angular.module("recipeApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("recipe", {
        url:"/recipe/:id",
        templateUrl: "templates/recipe.html",
        controller:"recipeCtrl"
    }).state("addRecipe", {
        url:"/addRecipe",
        templateUrl: "templates/addRecipe.html",
        controller:"addRecipeCtrl"
    });
});

module.controller("homeCtrl", function ($scope, recipeService) {
    var promise = recipeService.getTable();
    promise.then(function (data) {
        $scope.table = data.data;
        
        console.log(data.data);
    });
});

module.controller("loggInCtrl", function ($scope, recipeService){
    $scope.createUser = function () {
        recipeService.createUser($scope.name, $scope.password);
    };
});

module.controller("addRecipeCtrl", function ($scope, recipeService){
    $scope.addRecipe = function () {
        recipeService.addRecipe($scope.name, $scope.category, $scope.description, $scope.instruction, $scope.picture);
    };
});

module.controller("recipeCtrl", function ($scope, $stateParams, recipeService){
    var id = $stateParams;
    var promise = recipeService.getRecipe(id.id);

    promise.then(function (data){
        console.log(data.data);
        $scope.name = data.data[0].name;
        $scope.description = data.data[0].description;
        $scope.instruction = data.data[0].instruction;
        $scope.picture = data.data[0].picture;
    });
    var promiseIng = recipeService.getRecipeIngredients(id.id);
    promiseIng.then(function(data){
        console.log(data.data);
        $scope.table = data.data;
    });
});

module.service("recipeService", function ($q, $rootScope, $http) {
    this.getTable = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/RecipeApp/webresources/viewRecipes";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.getRecipe = function(id){
        var deffer = $q.defer();
        var url = "http://localhost:8080/RecipeApp/webresources/recipe/" + id;
        $http.get(url).then(function(data){
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.getRecipeIngredients = function(id){
        var deffer = $q.defer();
        var url = "http://localhost:8080/RecipeApp/webresources/ingredients/" + id;
        $http.get(url).then(function(data){
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.createUser = function (name, password) {
        var data = {
            name: name,
            password: password
        };
        var url = "http://localhost:8080/RecipeApp/webresources/createUser";

        $http({
            url: url,
            method: "POST",
            data: data
        }).then(function (data) {
            console.log("Användare tillagd");
            alert("Welcome to FoodBase " + name);
        },function (data){
            console.log("Användare med detta namnet finns redan, loggar in istället");
            loggIn(name, password);
        });
    };
    
    loggIn = function (username, password) {
        var url = "http://localhost:8080/RecipeApp/webresources/login";
        var auth = "Basic " + window.btoa(username + ":" + password);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Du är inloggad!");
            $rootScope.isLoggedIn = true;
            $rootScope.user = username;
            $rootScope.pass = password;
            console.log(username, password);
        }, function(data) {
            alert("Sorry, wrong password. Try again or create a new user");
            console.log("Du kan inte logga in");
        });
    };  
    
    this.addRecipe = function (name, category, description, instruction, picture) {
        var data = {
            name: name,
            categori_id: category,
            description: description,
            instruction: instruction,
            picture: picture
        };
        var url = "http://localhost:8080/RecipeApp/webresources/recipe";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);

        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Recept tillagt");
            alert("Du har lagt till: " + name);
        },function (data){
            console.log("Det gick inte att lägga till receptet");
        });
    };
    
});