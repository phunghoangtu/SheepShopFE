window.BanHangController = function (
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
  $scope.magiamgia = function () {
    if (document.getElementById("chuongtrinhkhuyenmaiCheck").checked == true) {
      document.getElementById("magiamgia").style.display = "none";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "block";
    } else {
      document.getElementById("magiamgia").style.display = "block";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "none";
    }
  };
  $scope.phiShip = 0;
  $scope.tienThanhToan = 0;
  $scope.giamGia = 0;
  $scope.magiamgia();
  let idBill = null;
  let codeBill = null;
  $scope.choose = function (code, id) {
    if (code == null || id == null) {
      document.getElementById("chitiet").style.display = "none";
      return;
    }
    document.getElementById("hinhThuc1").checked = true;
    document.getElementById("pay1").checked = true;
    document.getElementById("chuongtrinhkhuyenmaiCheck").checked = true;
    document.getElementById("diachichon").checked = true;
    document.getElementById("diachi").style.display = "none";
    document.getElementById("diachichon1").style.display = "none";
    document.getElementById("chuongtrinhkhuyenmai").style.display = "block";
    document.getElementById("magiamgia").style.display = "none";

    idBill = id;
    codeBill = code;

    //get all voucher
    $scope.listVoucher = [];
    $http
      .get("http://localhost:8080/api/product/getAllVoucher")
      .then(function (resp) {
        $scope.listVoucher = resp.data;
      });

    //get tỉnh
    $scope.listTinh = [];
    $http({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers: {
        token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
      },
    }).then(function (resp) {
      $scope.listTinh = resp.data.data;
    });
    $scope.getHuyen = function () {
      let tinh = document.getElementById("tinh").value;
      if (tinh === "") {
        tinh = 269;
      }
      $scope.listHuyen = [];
      $http({
        method: "GET",
        url:
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" +
          tinh,
        headers: {
          token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
        },
      }).then(function (resp) {
        $scope.listHuyen = resp.data.data;
      });
    };
    $scope.getXa = function () {
      let huyen = document.getElementById("huyen").value;
      if (huyen === "") {
        huyen = 2264;
      }
      $scope.listXa = [];
      $http({
        method: "GET",
        url:
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" +
          huyen,
        headers: {
          token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
        },
      }).then(function (resp) {
        $scope.listXa = resp.data.data;
      });
    };

    $scope.getHuyen();
    $scope.getXa();

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
    document.getElementById("chitiet").style.display = "block";
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
  };

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


  // thêm giỏ hàng
  let idPro = null;
  $scope.themvaogio = function (id) {
    $http
      .get("http://localhost:8080/api/productdetail_color_size/getbyid/" + id)
      .then(function (resp) {
        $http
          .get("http://localhost:8080/api/product/" + resp.data.idProductDetail)
          .then(function (pro) {
            if (resp.data.quantity == 0) {
              Swal.fire("Số lượng sản phẩm này đang tạm hết !", "", "error");
            } else {
              Swal.fire({
                title: "Mời nhập số lượng thêm vào giỏ",
                input: "text",
                showCancelButton: true,
              }).then((result) => {
                if (result.value.trim() === "") {
                  Swal.fire("Số lượng không được bỏ trống !", "", "error");
                  return;
                }
                if (result.value) {
                  if (parseInt(result.value) <= 0) {
                    Swal.fire("Số lượng phải lớn hơn 0 !", "", "error");
                    return;
                  }
                  if (parseInt(result.value) > 100) {
                    Swal.fire("Số lượng phải nhỏ hơn 100 !", "", "error");
                    return;
                  }

                  var numberRegex = /^[0-9]+$/;
                  if (!numberRegex.test(result.value)) {
                    Swal.fire("Số lượng phải là số !!", "", "error");
                    return;
                  }
                  //get số lượng sản phẩm đang có
                  var getPram = {
                    IdProduct: resp.data.idProductDetail,
                    IdColor: resp.data.idColor,
                    IdSize: resp.data.idSize,
                  };
                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                    params: getPram,
                  }).then(function (soluong) {
                    if (parseInt(soluong.data) < parseInt(result.value)) {
                      Swal.fire(
                        "Số lượng bạn nhập đang lớn hơn số lượng còn hàng !!",
                        "",
                        "error"
                      );
                      return;
                    }
                    $http
                      .get(
                        "http://localhost:8080/api/bill/getallbybill/" +
                          codeBill
                      )
                      .then(function (bill) {
                        for (let i = 0; i < bill.data.length; i++) {
                          if (
                            bill.data[i].productDetail.id ==
                              resp.data.idProductDetail &&
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
                                  idProductDetail: resp.data.idProductDetail,
                                  idColor: resp.data.idColor,
                                  idSize: resp.data.idSize,
                                  quantity:
                                    parseInt(result.value) +
                                    parseInt(bill.data[i].quantity),
                                  unitPrice: pro.data.price,
                                }
                              )
                              .then(function (billdetail) {
                                //get số lượng sản phẩm đang có
                                var getPram = {
                                  IdProduct: resp.data.idProductDetail,
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
                                    IdProduct: resp.data.idProductDetail,
                                    IdColor: resp.data.idColor,
                                    IdSize: resp.data.idSize,
                                    Quantity:
                                      parseInt(soluong.data) -
                                      parseInt(result.value),
                                  };
                                  $http({
                                    method: "PUT",
                                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                    params: param2,
                                  }).then(function (resp) {
                                    Swal.fire(
                                      "Đã thêm vào giỏ !",
                                      "",
                                      "success"
                                    );

                                    $scope.choose(codeBill, idBill);

                                    if ($scope.isPopupVisible == true) {
                                      $scope.getAllProduct();
                                    } else {
                                      console.log(pro.data.id);
                                      $scope.getAllByQR(pro.data.id);
                                    }
                                  });
                                });
                              });
                            return;
                          }
                        }

                        // nếu chưa tồn tại thì thêm vào giỏ
                        $http
                          .post(
                            "http://localhost:8080/api/bill/addBillDetail",
                            {
                              // add bill detail
                              idBill: idBill,
                              idProductDetail: resp.data.idProductDetail,
                              idColor: resp.data.idColor,
                              idSize: resp.data.idSize,
                              quantity: result.value,
                              unitPrice: pro.data.price,
                            }
                          )
                          .then(function (billdetail) {
                            //get số lượng sản phẩm đang có
                            var getPram = {
                              IdProduct: resp.data.idProductDetail,
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
                                IdProduct: resp.data.idProductDetail,
                                IdColor: resp.data.idColor,
                                IdSize: resp.data.idSize,
                                Quantity:
                                  parseInt(soluong.data) -
                                  parseInt(result.value),
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
                          });
                      });
                  });
                }
              });
            }
          });
      });
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
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 8,
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
    });
  };

  $scope.getAllByQR = function (id) {
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

    $scope.listProduct = [];
    $http
      .get(
        "http://localhost:8080/api/productdetail_color_size/getbyproduct/" +
          parseInt(id)
      )
      .then(function (response) {
        $scope.listProduct = response.data;
        $scope.choose(codeBill, idBill);
      });
    // pagation
    $scope.pager1 = {
      page: 0,
      size: 6,
      get items() {
        var start = this.page * this.size;
        return $scope.listProduct.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listProduct.length) / this.size);
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

  $scope.isQR1 = false;
  $scope.isSanPhamQR = false;
  $scope.SanPhamQR = function (id) {
    $scope.isSanPhamQR = !$scope.isSanPhamQR;
    document.getElementById("qrsp").style.display = "none";

    $scope.getAllByQR(id);
  };

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




};
