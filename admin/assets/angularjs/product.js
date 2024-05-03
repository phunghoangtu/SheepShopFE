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

  // pagation prododuct all
  $scope.pager = {
    page: 0,
    size: 10,
    get items() {
      var start = this.page * this.size;
      return $scope.list.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.list.length) / this.size);
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

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // detail products
  $scope.images = [];
  $scope.imagesList = [];
  let check = 0;
  $scope.openImage = function () {
    check++;
    if (check === 1) {
      $scope.change();
    }
    document.getElementById("fileList").click();
  };

  $scope.change = function () {
    document.getElementById("fileList").addEventListener("change", function () {
      var files = this.files;
      if (files.length > 3) {
        Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
        return;
      }
      if ($scope.images.length >= 3) {
        Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
        return;
      }
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.startsWith("image/")) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.images.push(e.target.result);
            });
          };
          reader.readAsDataURL(file);
          $scope.imagesList.push(file);
        }
      }
    });
  };

  $scope.imageDelete = [];
  $scope.deleteImage = function (index) {
    var deletedItem = $scope.images.splice(index, 1);
    $scope.imageDelete.push(deletedItem[0]);
  };

  $scope.isChiTietSanPham = false;

  $scope.closeChiTiet = function () {
    $scope.isChiTietSanPham = !$scope.isChiTietSanPham;
  };

  $scope.openChiTiet = function (id) {
    document.getElementById("qrcode").innerHTML = "";
    var qrcod = new QRCode(document.getElementById("qrcode"));
    $scope.isChiTietSanPham = !$scope.isChiTietSanPham;
    qrcod.makeCode(id.toString());
    $scope.form = {};

    $http
      .get("http://localhost:8080/api/product/" + id)
      .then(function (detail) {
        $scope.form = detail.data;
        console.log(detail.data);
      });
    $http
      .get("http://localhost:8080/api/product/quantitySold/" + id)
      .then(function (detail) {
        $scope.quantitySold = detail.data == "" ? 0 : detail.data;
      });
    $http
      .get("http://localhost:8080/api/product/totalSold/" + id)
      .then(function (detail) {
        $scope.totalSold = detail.data == "" ? 0 : detail.data;
      });
  };


  
  ////////////////////////////////////////////////////////////////////////////////////////////////
};
