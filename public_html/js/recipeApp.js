var module = angular.module("recipeApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    });
    
});

module.controller("homeCtrl", function ($scope, recipeService) {
    var promise = recipeService.getTable();
    promise.then(function (data) {
        $scope.table = data.data;
        
        console.log(data.data);
    });
});

module.service("recipeService", function ($q, $http) {
    this.getTable = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/RecipeApp/webresources/recipes";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
});


