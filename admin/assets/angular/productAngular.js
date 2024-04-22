var app = angular.module("myApp", []);

app.controller("MyController", function ($scope, $http) {
    var pageSize = 5;
    var url = "http://localhost:8080/api/product";

    $scope.setProduct = function (product) {
        $scope.product = product;
    };

    var getProducts = function (page) {
        $http.get(url + "?page=" + page + "&limit=" + pageSize)
            .then(function (response) {
                $scope.products = response.data;
            });
    };

    $scope.totalPage = function () {
        return Math.ceil(100 / pageSize);
    };

    $scope.pageRange = function () {
        var range = [];
        var totalPage = $scope.totalPage();
        for (var i = 1; i <= totalPage; i++) {
            range.push(i);
        }
        return range;
    };

    $scope.showDetail = function (product) {
        $scope.selectedProduct = product;
    };

    $scope.startPage = 1;
    $scope.endPage = 5;

    $scope.updatePageRange = function () {
        if ($scope.currentPage <= 3) {
            $scope.startPage = 1;
            $scope.endPage = Math.min($scope.totalPage(), 5);
        } else if ($scope.currentPage > $scope.totalPage() - 2) {
            $scope.startPage = Math.max($scope.totalPage() - 4, 1);
            $scope.endPage = $scope.totalPage();
        } else {
            $scope.startPage = $scope.currentPage - 2;
            $scope.endPage = $scope.currentPage + 2;
        }
    };

    $scope.limitPage = 5;
    $scope.currentPage = 1;

    $scope.goToPage = function (page) {
        if (page >= 1 && page <= $scope.totalPage()) {
            $scope.currentPage = page;
            getProducts($scope.currentPage);
            $scope.updatePageRange();
        }
    };

    $scope.goToPreviousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getProducts($scope.currentPage);
            $scope.updatePageRange();
        }
    };

    $scope.goToNextPage = function () {
        if ($scope.currentPage < $scope.totalPage()) {
            $scope.currentPage++;
            getProducts($scope.currentPage);
            $scope.updatePageRange();
        }
    };

    angular.element(document).ready(function () {
        getProducts($scope.currentPage);
    });

    // CRUD operations
    $scope.getProductById = function (id) {
        $http.get(url + "/" + id)
            .then(function (response) {
                var product = response.data;
                $scope.image = product.image.code;
                $scope.code = product.code;
                $scope.name = product.name;
                $scope.price = product.price;
                $scope.quantity = product.quantity;
                $scope.brand = product.brand.name;
                $scope.collarStyle = product.collarStyle.name;
                $scope.color = product.color.name;
                $scope.size = product.size.name;
                $scope.material = product.material.name;
                $scope.category = product.category.name;
            });
    };
});