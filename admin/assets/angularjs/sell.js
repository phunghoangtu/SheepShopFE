window.SellController = function (
  $scope,
  $http,
  $location,
  $routeParams,
  $rootScope,
  AuthService
) {
  //tạo hóa đơn
  $scope.addBill = function () {
    // add bill
    $http
      .post("http://localhost:8080/api/bill/billTaiQuay", {
        status: 10,
        idEmployee: AuthService.getId(),
        typeStatus: 1,
      })
      .then(function (bill) {
        Swal.fire(
          "Tạo hóa đơn " + bill.data.code + " thành công !",
          "",
          "success"
        );
        $http.post("http://localhost:8080/api/billhistory", {
          createBy: $rootScope.user.username,
          note: "Tạo hóa đơn tại quầy",
          status: 0,
          idBill: bill.data.id,
        });
        $scope.getAllBill();
      });
  };

  //hiển thị hóa đơn chờ
  $scope.getAllBill = function () {
    $scope.listBill = [];
    $http
      .get("http://localhost:8080/api/bill/getbystatus/10")
      .then(function (resp) {
        $scope.listBill = resp.data;
      });

    // pagation
    $scope.pager = {
      page: 0,
      size: 7,
      get items() {
        var start = this.page * this.size;
        return $scope.listBill.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listBill.length) / this.size);
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
  };
  $scope.getAllBill();

  ////////////////////////////////

  // $scope.magiamgia = function () {
  //   if (document.getElementById("chuongtrinhkhuyenmaiCheck").checked == true) {
  //     document.getElementById("magiamgia").style.display = "none";
  //     document.getElementById("chuongtrinhkhuyenmai").style.display = "block";
  //   } else {
  //     document.getElementById("magiamgia").style.display = "block";
  //     document.getElementById("chuongtrinhkhuyenmai").style.display = "none";
  //   }
  // };
  // $scope.magiamgia();

  $scope.phiShip = 0;
  $scope.tienThanhToan = 0;
  $scope.giamGia = 0;

  let idBill = null;
  let codeBill = null;

  $scope.choose = function (code, id) {
    $scope.hoadonCode = { code };
    idBill = id;
    codeBill = code;

    //get
    $http
      .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
      .then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien +=
            parseFloat($scope.listItem[i].unitPrice) *
            parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].productDetail.weight *
            $scope.listItem[i].quantity;
        }
        $scope.tienThanhToan =
          $scope.tongTien + $scope.phiShip - $scope.giamGia;
      });

    // lấy danh sách khách hàng

    $scope.listCustomer = [];
    $http.get("http://localhost:8080/api/customer").then(function (resp) {
      $scope.listCustomer = resp.data;
    });

    ////////////////////////////////////////////////////////////////////
    $scope.listItem = [];
    idBill = id;
    $scope.hoadon = {};
    $http
      .get("http://localhost:8080/api/bill/getbycode/" + code)
      .then(function (resp) {
        $scope.hoadon = resp.data;
        $scope.nhanVien = {};
        $http
          .get("http://localhost:8080/api/employee/" + resp.data.idEmployee)
          .then(function (resp) {
            $scope.nhanVien = resp.data;
          });
      });

    $http
      .get("http://localhost:8080/api/bill/getallbybill/" + code)
      .then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien +=
            parseFloat($scope.listItem[i].unitPrice) *
            parseFloat($scope.listItem[i].quantity);
        }
      });

    $scope.getTotalQuantity = function () {
      var totalQuantity = 0;
      for (var i = 0; i < $scope.listItem.length; i++) {
        totalQuantity += $scope.listItem[i].quantity;
      }
      return totalQuantity;
    };

    $scope.getTotalPrice = function () {
      $scope.tienThanhToan;
    };
  };
  ///////////////////////////////////////////////////

  $scope.showProducts = false;
 
  $scope.getAllProduct = function () {
    let url = "http://localhost:8080/api/product";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
  
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
    //load product
    $scope.listPro = [];
    $http.get(url).then(function (response) {
      $scope.listPro = response.data;
    });
    $scope.listQuantity = [];
    //load size and color of product
    $http
      .get("http://localhost:8080/api/productdetail_color_size/getall")
      .then(function (resp) {
        $scope.listQuantity = resp.data;
      });
  };

  $scope.getAllProduct();

  $scope.search = function () {
    // Kiểm tra xem có dữ liệu nhập vào hay không
    if ($scope.query) {
      // Hiển thị danh sách sản phẩm
      $scope.getAllProduct();
      $scope.showProducts = true;
    } else {
      $scope.getAllProduct();
      // Ẩn danh sách sản phẩm nếu không có dữ liệu nhập vào
      $scope.showProducts = false;
    }
  };

  $scope.timkiem = function () {
    var text = document.getElementById("name").value;
    var idColor = document.getElementById("mausac").value;
    var idSize = document.getElementById("kichthuoc").value;
    let idcolor = idColor != "" ? idColor : null;
    let idsize = idSize != "" ? idSize : null;
    let text1 = text != "" ? text : null;
  
    var param = {
      keyword: text1,
      idColor: idcolor,
      idSize: idsize,
    };
    $http({
      method: "GET",
      url: "http://localhost:8080/api/productdetail_color_size/getallbykeyword",
      params: param,
    }).then(function (resp) {
      $scope.listQuantity = resp.data;
    });
  };

  $scope.selectProduct = function (product) {
    // Xử lý khi người dùng chọn một sản phẩm từ danh sách


  };

  //////////////////////////////////////////////////////

  $scope.currentDate = new Date();

  // validate khách thanh toán
  $scope.isNumberKey = function (event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 44 &&
      charCode !== 46
    ) {
      event.preventDefault();
    }
  };

  $scope.khachCanTra = function () {
    return $scope.accumulatedPrice;
  };

  $scope.khachThanhToan = $scope.khachCanTra(); // Gán giá trị khách cần trả cho khách thanh toán ban đầu

  $scope.tinhTienThua = function () {
    return $scope.khachThanhToan - $scope.accumulatedPrice;
  };
};
