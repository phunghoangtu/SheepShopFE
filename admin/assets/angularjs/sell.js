window.SellController = function (
  $scope,
  $http,
  $location,
  $routeParams,
  $rootScope,
  AuthService
) {
  //tạo hóa đơn
  $scope.addbill = function () {
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

  // get all
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
    if (code == null || id == null) {
      return;
    }

    idBill = id;
    codeBill = code;

    //get all voucher
    $scope.listVoucher = [];
    $http
      .get("http://localhost:8080/api/product/getAllVoucher")
      .then(function (resp) {
        $scope.listVoucher = resp.data;
      });

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
        // lấy thông tin địa chỉ giao hàng

        // var params = {
        // service_type_id: 2,
        // insurance_value: parseInt($scope.tongTien),
        // coupon: null,
        // from_district_id: 1482,
        // to_district_id: 2264,
        // to_ward_code: 90816,
        // height: 0,
        // length: 0,
        // weight: parseInt(TotalGam),
        // width: 0,
        // };
        // // get phí ship từ GHN
        // $http({
        // method: "GET",
        // url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        // params: params,
        // headers: {
        // "Content-Type": undefined,
        // token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
        // shop_id: 4603004,
        // },
        // }).then(function (resp) {
        // $scope.phiShip = resp.data.data.total;

        // });
      });

    $scope.listCustomer = [];
    $http.get("http://localhost:8080/api/customer").then(function (resp) {
      $scope.listCustomer = resp.data;
    });

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
  //giảm số lượng giỏ
  $scope.giam = function (id) {
    if (document.getElementById("quantity" + id).value == 1) {
      $scope.deleteBillDetail(id);
      return;
    }

    $http
      .get("http://localhost:8080/api/bill/getbilldetail/" + id)
      .then(function (resp) {
        $http
          .get(
            "http://localhost:8080/api/product/" + resp.data.productDetail.id
          )
          .then(function (pro) {
            $http
              .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
              .then(function (bill) {
                for (let i = 0; i < bill.data.length; i++) {
                  if (
                    bill.data[i].productDetail.id ==
                      resp.data.productDetail.id &&
                    bill.data[i].idColor == resp.data.idColor &&
                    bill.data[i].idSize == resp.data.idSize
                  ) {
                    // nếu tồn tại rồi thì updatate số lượng
                    $http
                      .put(
                        "http://localhost:8080/api/bill/updateBillDetail/" +
                          bill.data[i].id,
                        {
                          idBill: idBill,
                          idProductDetail: resp.data.productDetail.id,
                          idColor: resp.data.idColor,
                          idSize: resp.data.idSize,
                          quantity: parseInt(bill.data[i].quantity) - 1,
                          unitPrice: pro.data.price,
                        }
                      )
                      .then(function (billdetail) {
                        //get số lượng sản phẩm đang có
                        var getPram = {
                          IdProduct: resp.data.productDetail.id,
                          IdColor: resp.data.idColor,
                          IdSize: resp.data.idSize,
                        };
                        $http({
                          method: "GET",
                          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                          params: getPram,
                        }).then(function (soluong) {
                          //  cập nhật số lượng sản phẩm
                          var param2 = {
                            IdProduct: resp.data.productDetail.id,
                            IdColor: resp.data.idColor,
                            IdSize: resp.data.idSize,
                            Quantity: parseInt(soluong.data) + 1,
                          };
                          $http({
                            method: "PUT",
                            url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                            params: param2,
                          }).then(function (resp) {
                            $scope.choose(codeBill, idBill);
                            $scope.getAllProduct();
                          });
                        });
                      });
                    return;
                  }
                }
              });
          });
      });
  };
  //tăng số lượng giỏ
  $scope.tang = function (id) {
    $http
      .get("http://localhost:8080/api/bill/getbilldetail/" + id)
      .then(function (resp) {
        $http
          .get(
            "http://localhost:8080/api/product/" + resp.data.productDetail.id
          )
          .then(function (pro) {
            //get số lượng sản phẩm đang có
            var getPram = {
              IdProduct: resp.data.productDetail.id,
              IdColor: resp.data.idColor,
              IdSize: resp.data.idSize,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: getPram,
            }).then(function (soluong) {
              if (soluong.data === 0) {
                Swal.fire("Đã đạt số lượng tối đa", "", "error");
                return;
              }
              $http
                .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
                .then(function (bill) {
                  for (let i = 0; i < bill.data.length; i++) {
                    if (
                      bill.data[i].productDetail.id ==
                        resp.data.productDetail.id &&
                      bill.data[i].idColor == resp.data.idColor &&
                      bill.data[i].idSize == resp.data.idSize
                    ) {
                      // nếu tồn tại rồi thì updatate số lượng
                      $http
                        .put(
                          "http://localhost:8080/api/bill/updateBillDetail/" +
                            bill.data[i].id,
                          {
                            idBill: idBill,
                            idProductDetail: resp.data.productDetail.id,
                            idColor: resp.data.idColor,
                            idSize: resp.data.idSize,
                            quantity: parseInt(bill.data[i].quantity) + 1,
                            unitPrice: pro.data.price,
                          }
                        )
                        .then(function (billdetail) {
                          //get số lượng sản phẩm đang có
                          var getPram = {
                            IdProduct: resp.data.productDetail.id,
                            IdColor: resp.data.idColor,
                            IdSize: resp.data.idSize,
                          };
                          $http({
                            method: "GET",
                            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                            params: getPram,
                          }).then(function (soluong) {
                            //  cập nhật số lượng sản phẩm
                            var param2 = {
                              IdProduct: resp.data.productDetail.id,
                              IdColor: resp.data.idColor,
                              IdSize: resp.data.idSize,
                              Quantity: parseInt(soluong.data) - 1,
                            };
                            $http({
                              method: "PUT",
                              url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                              params: param2,
                            }).then(function (resp) {
                              $scope.choose(codeBill, idBill);
                              $scope.getAllProduct();
                            });
                          });
                        });
                      return;
                    }
                  }
                });
            });
          });
      });
  };
  //xóa bill detail
  $scope.deleteBillDetail = function (id) {
    Swal.fire({
      title: "Bạn có chắc muốn xóa giỏ hàng ?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http
          .get("http://localhost:8080/api/bill/getbilldetail/" + id)
          .then(function (resp) {
            $http
              .get(
                "http://localhost:8080/api/product/" +
                  resp.data.productDetail.id
              )
              .then(function (pro) {
                //get số lượng sản phẩm đang có
                var getPram = {
                  IdProduct: resp.data.productDetail.id,
                  IdColor: resp.data.idColor,
                  IdSize: resp.data.idSize,
                };
                $http({
                  method: "GET",
                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                  params: getPram,
                }).then(function (soluong) {
                  //  cập nhật số lượng sản phẩm
                  var param2 = {
                    IdProduct: resp.data.productDetail.id,
                    IdColor: resp.data.idColor,
                    IdSize: resp.data.idSize,
                    Quantity:
                      parseInt(soluong.data) + parseInt(resp.data.quantity),
                  };
                  $http({
                    method: "PUT",
                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                    params: param2,
                  }).then(function (resp) {
                    $http
                      .get(
                        "http://localhost:8080/api/bill/deleteBillDetail/" + id
                      )
                      .then(function (resp) {
                        Swal.fire("Xóa thành công !", "", "success");

                        $scope.choose(codeBill, idBill);
                        $scope.getAllProduct();
                      });
                  });
                });
              });
          });
      }
    });
  };
  //hủy hóa đơn
  $scope.huyhoadon = function (code) {
    Swal.fire({
      title: "Xác nhận hủy đơn hàng " + code + " ?",
      showCancelButton: true,
      confirmButtonText: "Hủy",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http
          .get("http://localhost:8080/api/bill/huy/" + code)
          .then(function (response) {
            $http
              .get("http://localhost:8080/api/bill/getallbybill/" + code)
              .then(function (resp) {
                for (let i = 0; i < resp.data.length; i++) {
                  //get số lượng sản phẩm đang có
                  var getPram = {
                    IdProduct: resp.data[i].productDetail.id,
                    IdColor: resp.data[i].idColor,
                    IdSize: resp.data[i].idSize,
                  };
                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                    params: getPram,
                  }).then(function (soluong) {
                    var param2 = {
                      IdProduct: resp.data[i].productDetail.id,
                      IdColor: resp.data[i].idColor,
                      IdSize: resp.data[i].idSize,
                      Quantity:
                        parseInt(soluong.data) +
                        parseInt(resp.data[i].quantity),
                    };
                    $http({
                      method: "PUT",
                      url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                      params: param2,
                    });
                  });
                }
              });
            Swal.fire(
              "Hủy đơn hàng thành công !",
              "Bạn đã hủy thành công đơn hàng " + code,
              "success"
            );
            $scope.getAllBill();
            $scope.choose(null, null);
          });
      }
    });
  };
  ////////////////////////////////////////////////////
  $scope.isPopupVisible = false;
  $scope.togglePopup = function () {
    $scope.isPopupVisible = !$scope.isPopupVisible;

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
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 6,
        get items() {
          var start = this.page * this.size;
          return $scope.listQuantity.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listQuantity.length) / this.size);
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

    $scope.getAllProduct();
  };
  ////////////////////////////////////////////////////

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

  // $scope.search = function () {
  //   // Kiểm tra xem có dữ liệu nhập vào hay không
  //   if ($scope.query) {
  //     // Hiển thị danh sách sản phẩm
  //     $scope.getAllProduct();
  //     $scope.showProducts = true;
  //   } else {
  //     $scope.getAllProduct();
  //     // Ẩn danh sách sản phẩm nếu không có dữ liệu nhập vào
  //     $scope.showProducts = false;
  //   }
  // };

  //////////////////////////////////////////////////////////////////////////////////////////////
  // thêm giỏ hàng



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
};
