window.ProductController = function (
  $scope,
  $http,
  $location,
  $routeParams,
  $rootScope
) {
  let url = "http://localhost:8080/api/product";
  let urlcategory = "http://localhost:8080/api/category";
  let urlbrand = "http://localhost:8080/api/brand";
  let urlmaterial = "http://localhost:8080/api/material";
  let urlcolor = "http://localhost:8080/api/color";
  let urlsize = "http://localhost:8080/api/size";
  let urldesign = "http://localhost:8080/api/design";
  $scope.loadAll = function () {
    //load product
    $scope.list = [];
    $http.get(url).then(function (response) {
      $scope.list = response.data;
    });
    $scope.getQuantity = function (sp) {
      $scope.quantityWarning = 0;

      for (let i = 0; i < sp.productDetail_size_colors.length; i++) {
        $scope.quantityWarning =
          $scope.quantityWarning + sp.productDetail_size_colors[i].quantity;
      }

      if ($scope.quantityWarning === 0) {
        sp.quantityWarningText = "Số lượng đã hết";
      }
      if ($scope.quantityWarning < 10 && $scope.quantityWarning > 0) {
        sp.quantityWarningText = "Số lượng sắp hết";
      }
    };
    // load category
    $scope.listCategory = [];
    $http.get(urlcategory).then(function (response) {
      $scope.listCategory = response.data;
    });
    $scope.listVoucher = [];
    $http
      .get("http://localhost:8080/api/product/getVoucher")
      .then(function (response) {
        $scope.listVoucher = response.data;
      });
    // load brand
    $scope.listBrand = [];
    $http.get(urlbrand).then(function (response) {
      $scope.listBrand = response.data;
    });
    // load material
    $scope.listMaterial = [];
    $http.get(urlmaterial).then(function (response) {
      $scope.listMaterial = response.data;
    });
    // load color
    $scope.listColor = [];
    $http.get(urlcolor).then(function (response) {
      $scope.listColor = response.data;
    });
    // load size
    $scope.listSize = [];
    $http.get(urlsize).then(function (response) {
      $scope.listSize = response.data;
    });
    // load design
    $scope.listDesign = [];
    $http.get(urldesign).then(function (response) {
      $scope.listDesign = response.data;
    });
    // load product
    $scope.list1 = [];
    $http
      .get("http://localhost:8080/api/product/findAll")
      .then(function (response) {
        $scope.list1 = response.data;
      });

    $scope.operationhistory = [];
    $http
      .get("http://localhost:8080/api/operationhistory")
      .then(function (resp) {
        $scope.operationhistory = resp.data;
        // pagation
        $scope.pagerop = {
          page: 0,
          size: 10,
          get items() {
            var start = this.page * this.size;
            return $scope.operationhistory.slice(start, start + this.size);
          },
          get count() {
            return Math.ceil(
              (1.0 * $scope.operationhistory.length) / this.size
            );
          },

          first() {
            this.page = 0;
          },
          prev() {
            this.page--;
            if (this.page < 0) {
              this.last();
            }
          },
          next() {
            this.page++;
            if (this.page >= this.count) {
              this.first();
            }
          },
          last() {
            this.page = this.count - 1;
          },
        };
      });
  };
  $scope.loadAll();

  ////////////////////////////////////////////////////////////////////////////////////////////////
};
