window.ThongKeController = function ($scope, $http, $location) {
  //   document.getElementById("hoadon").checked = true;
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("tungay").max = today;
  document.getElementById("denngay").max = today;

  $scope.ngay = {};
  $http.get("http://localhost:8080/api/bill/gettkngay").then(function (ngay) {
    $scope.ngay = ngay.data;
  });

  $scope.thang = {};
  $http.get("http://localhost:8080/api/bill/gettkthang").then(function (thang) {
    $scope.thang = thang.data;
  });
  $scope.slthang = {};
  $http
    .get("http://localhost:8080/api/bill/gettkslthang")
    .then(function (thang) {
      $scope.slthang = thang.data;
    });

  //load product ban chay
  $scope.listProductSold = [];
  $http
    .get("http://localhost:8080/api/bill/gettksanpham")
    .then(function (response) {
      $scope.listProductSold = response.data;
    });
  // pagation
  $scope.pagerProductSold = {
    page: 0,
    size: 5,
    get items() {
      var start = this.page * this.size;
      return $scope.listProductSold.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.listProductSold.length) / this.size);
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

  ///////////////////////////////////////////////////////////////////
};
