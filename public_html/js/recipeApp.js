var module = angular.module("recipeApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("recipe", {
        url:"/recipe",
        templateUrl: "templates/recipe.html",
        controller:"recipeCtrl"
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

module.service("recipeService", function ($q, $rootScope, $http) {
    this.getTable = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/RecipeApp/webresources/viewRecipes";
        $http.get(url).then(function (data) {
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
        }, function(data) {
            alert("Wrong password");
            console.log("Du kan inte logga in");
        });
    };
    
});

