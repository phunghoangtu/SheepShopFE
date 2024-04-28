var app = angular.module("myApp", ["ngRoute", "ngStorage"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "index.html",
            controller : "homeController"
        })
});