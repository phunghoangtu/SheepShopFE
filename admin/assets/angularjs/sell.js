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

  //////////////////////////////////////////////////////////////////////////////////////////////

  // thêm giỏ hàng
  let idPro = null;
  $scope.themvaogio = function (id) {
    // Xử lý khi người dùng chọn một sản phẩm từ danh sách
    $http
      .get("http://localhost:8080/api/productdetail_color_size/getbyid/" + id)
      .then(function (resp) {
        $http
          .get("http://localhost:8080/api/product/" + resp.data.idProductDetail)
          .then(function (pro) {
            if (resp.data.quantity == 0) {
              Swal.fire("Số lượng sản phẩm này đang tạm hết !", "", "error");
            } else {
              // Kiểm tra sản phẩm có tồn tại trong giỏ hàng hay không
              var isProductExist = false;
              var existingBillDetailId = null;

              $http
                .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
                .then(function (bill) {
                  for (let i = 0; i < bill.data.length; i++) {
                    if (
                        bill.data[i].productDetail.id ==
                        resp.data.idProductDetail &&
                        bill.data[i].idColor == resp.data.idColor &&
                        bill.data[i].idSize == resp.data.idSize
                    ) {
                      isProductExist = true;
                      existingBillDetailId = bill.data[i].id;
                      break;
                    }
                  }

                  if (isProductExist) {
                    // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                    $http
                      .put(
                        "http://localhost:8080/api/bill/updateBillDetail/" +
                          existingBillDetailId,
                        {
                          idBill: idBill,
                          idProductDetail: resp.data.idProductDetail,
                          idColor: resp.data.idColor,
                          idSize: resp.data.idSize,
                          quantity: resp.data.quantity + 1,
                          unitPrice: pro.data.price,
                        }
                      )
                      .then(function (billdetail) {
                        // Cập nhật số lượng sản phẩm
                        var param2 = {
                          IdProductDetail: resp.data.idProductDetail,
                          IdColor: resp.data.idColor,
                          IdSize: resp.data.idSize,
                          Quantity: resp.data.quantity - 1,
                        };

                        $http({
                          method: "PUT",
                          url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                          params: param2,
                        }).then(function (resp) {
                          Swal.fire("Đã thêm vào giỏ !", "", "success");
                          $scope.choose(codeBill, idBill);

                          if ($scope.isPopupVisible == true) {
                            $scope.getAllProduct();
                          } else {
                            console.log(pro.data.id);
                            $scope.getAllByQR(pro.data.id);
                          }
                        });
                      });
                  } else {
                    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm vào giỏ hàng
                    var billDetail = {
                      idBill: idBill,
                      idProductDetail: resp.data.idProductDetail,
                      idColor: resp.data.idColor,
                      idSize: resp.data.idSize,
                      quantity: 1, // Số lượng mặc định là 1
                      unitPrice: pro.data.price,
                    };

                    $http
                      .post(
                        "http://localhost:8080/api/bill/addBillDetail",
                        billDetail
                      )
                      .then(function (billdetail) {
                        // Cập nhật số lượng sản phẩm
                        var param2 = {
                          IdProduct: resp.data.idProductDetail,
                          IdColor: resp.data.idColor,
                          IdSize: resp.data.idSize,
                          Quantity: resp.data.quantity - 1,
                        };

                        $http({
                          method: "PUT",
                          url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                          params: param2,
                        }).then(function (resp) {
                          Swal.fire("Đã thêm vào giỏ !", "", "success");
                          $scope.choose(codeBill, idBill);

                          if ($scope.isPopupVisible == true) {
                            $scope.getAllProduct();
                          } else {
                            console.log(pro.data.id);
                            $scope.getAllByQR(pro.data.id);
                          }
                        });
                      });
                  }
                });
            }
          });
      });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////

  $scope.webcam = function () {
    $scope.isQR1 = !$scope.isQR1;
    if ($scope.isQR1 == false) {
      const video1 = document.getElementById("video");
      const stream1 = video1.srcObject;
      const tracks1 = stream1.getTracks();

      tracks1.forEach(function (track) {
        track.stop();
      });

      video1.srcObject = null;
      document.getElementById("qr").style.display = "none";
      return;
    }
    document.getElementById("qr").style.display = "block";
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        const video = document.getElementById("video");
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error("Lỗi truy cập máy ảnh: ", error);
      });

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const video = document.getElementById("video");

    const scan = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        // Có dữ liệu từ mã QR, tắt model quét QR

        $scope.SanPhamQR(code.data);
        $scope.isQR1 = false;
        document.getElementById("qr").style.display = "none";
        document.getElementById("qrsp").style.display = "block";
        const video1 = document.getElementById("video");
        const stream1 = video1.srcObject;
        const tracks1 = stream1.getTracks();

        tracks1.forEach(function (track) {
          track.stop();
        });

        video1.srcObject = null;

        return;
      } else {
        document.getElementById("result").textContent = "Không tìm thấy mã QR.";
      }

      requestAnimationFrame(scan);
    };

    video.onloadedmetadata = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      scan();
    };
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////

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
