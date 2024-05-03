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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  $scope.giamGia = function () {
    if (document.getElementById("giamGia").checked == true) {
      document.getElementById("giamGia1").style.display = "block";
      document.getElementById("khongGioiHan1").style.display = "block";
      document.getElementById("khongGioiHan").checked = true;
    } else {
      document.getElementById("giamGia1").style.display = "none";
      document.getElementById("khongGioiHan1").style.display = "none";
      document.getElementById("tamThoi1").style.display = "none";
      document.getElementById("khongGioiHan").checked = true;
    }
  };
  $scope.giamGia1 = function () {
    if (document.getElementById("khongGioiHan").checked == true) {
      document.getElementById("khongGioiHan1").style.display = "block";
      document.getElementById("tamThoi1").style.display = "none";
      document.getElementById("phanTramGiamGia").style.display = "block";
      document.getElementById("phanTramGiamGia1").style.display = "none";
      document.getElementById("thoiGianGiamGia").style.display = "none";
    } else {
      document.getElementById("khongGioiHan1").style.display = "none";
      document.getElementById("tamThoi1").style.display = "block";
      document.getElementById("phanTramGiamGia").style.display = "none";
      document.getElementById("phanTramGiamGia1").style.display = "block";
      document.getElementById("thoiGianGiamGia").style.display = "block";
      var today = new Date().toISOString().split("T")[0];
      document.getElementById("thoiGianGiamGia").min = today;
    }
  };
  $scope.colorStates = {}; // Tạo một đối tượng để lưu trạng thái hiển thị cho từng màu
  $scope.pushColor = [];
  $scope.checkbox = function (mausac) {
    var mau = {
      id: mausac,
    };
    var checkBox = document.getElementById("Color" + mausac);

    // Kiểm tra nút checkbox đã được chọn hay chưa
    if (checkBox.checked) {
      $scope.colorStates[mausac] = true;

      $scope.pushColor.push(mau);
    } else {
      $scope.colorStates[mausac] = false;
    }
    $scope.mau = {};
  };
  $scope.voucherList = [];
  $scope.addChuongTrinh = function () {
    var id = document.getElementById("voucher").value;
    var vouchers = $scope.voucherList;
    var index = $scope.findIndexVoucher(vouchers, id);
    if (index == -1) {
      var voucher = {
        id: id,
      };

      // Thêm newItem vào mảng kích thước của màu sắc tương ứng
      $scope.voucherList.push(voucher);

      // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
      $scope.voucher = {};
    } else {
      Swal.fire("Chương trình này đã được thêm trước đó !", "", "error");
    }
  };
  $scope.isPopupVisible = false;
  $scope.colorSizes = {}; // Đối tượng để lưu trữ các kích thước cho từng màu sắc
  let id;
  $scope.themkichthuoc = function (idColor) {
    $scope.isPopupVisible = !$scope.isPopupVisible;
    id = idColor;
    $scope.idCc = idColor;
    if (!$scope.colorSizes[idColor]) {
      $scope.colorSizes[idColor] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //add product
  $scope.add = function () {
    let check = 0;
    let phanTram = 0;
    let discountDate = null;
    if (document.getElementById("giamGia").checked == true) {
      if (document.getElementById("khongGioiHan").checked == true) {
        phanTram = document.getElementById("phanTramGiamGia").value;
      } else {
        phanTram = document.getElementById("phanTramGiamGia1").value;
      }
    }
    if (document.getElementById("tamThoi").checked == true) {
      if (document.getElementById("thoiGianGiamGia").value === "") {
        Swal.fire("Vui lòng chọn thời gian kết thúc giảm giá !", "", "error");
        return;
      }
      discountDate = document.getElementById("thoiGianGiamGia").value;
    }

    var MainImage = document.getElementById("fileUpload").files;
    if (MainImage.length == 0) {
      Swal.fire("Vui lòng thêm ảnh đại diện cho sản phẩm !", "", "error");
      return;
    }
    $scope.get = function (name) {
      return document.getElementById(name).value;
    };
    //validate
    $http
      .post("http://localhost:8080/api/product/validate", {
        code: $scope.form.product.code,
        name: $scope.form.product.name,
        discount: phanTram,
        price: $scope.form.price,   
        description: $scope.form.description,
      })
      .then(function (vali) {
        if (vali.status === 200) {
          //validate
          $scope.validationErrors = [];
          let indexMaterial = 0;
          for (let i = 0; i < $scope.listMaterial.length; i++) {
            let checkIndexMaterial = document.getElementById(
              "Material" + $scope.listMaterial[i].id
            );
            if (checkIndexMaterial.checked == true) {
              indexMaterial++;
            }
          }
          let indexColor = 0;
          for (let i = 0; i < $scope.listColor.length; i++) {
            let checkIndexColor = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (checkIndexColor.checked == true) {
              indexColor++;
            }
          }
          if (indexMaterial === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          if (indexColor === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          // check size and color

          for (let i = 0; i < $scope.listColor.length; i++) {
            let color = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (color.checked == true) {
              let iddexQuantity = 0;
              let check = 0;
              for (let j = 0; j < $scope.listSize.length; j++) {
                let quantity = document.getElementById(
                  "Color" +
                    $scope.listColor[i].id +
                    "Size" +
                    $scope.listSize[j].id
                );
                if (quantity === null) {
                  check++;
                }
                if (check === $scope.listSize.length) {
                  Swal.fire(
                    "Vui lòng thêm ít nhất 1 kích thước cho màu " +
                      $scope.listColor[i].name +
                      " !",
                    "",
                    "error"
                  );
                  return;
                }
                if (quantity !== null) {
                  if (quantity.value == 0) {
                    iddexQuantity++;
                  }
                  if (quantity.value < 0 || quantity > 999) {
                    Swal.fire(
                      "Số lượng size " +
                        $scope.listSize[j].name +
                        " màu " +
                        $scope.listColor[i].name +
                        " phải lớn hơn bằng 0 và nhỏ hơn 999 !",
                      "",
                      "error"
                    );
                    return;
                  }
                  if (quantity.value.trim() === "") {
                    Swal.fire(
                      "Số lượng size " +
                        $scope.listSize[j].name +
                        " màu " +
                        $scope.listColor[i].name +
                        " không được bỏ trống !",
                      "",
                      "error"
                    );
                    document.getElementById(
                      "Color" +
                        $scope.listColor[i].id +
                        "Size" +
                        $scope.listSize[j].id
                    ).value = 0;
                    return;
                  }
                }
              }
              if (iddexQuantity === $scope.listSize.length) {
                Swal.fire(
                  "Vui lòng nhập số lượng kích thước tối thiểu cho màu " +
                    $scope.listColor[i].name +
                    " !",
                  "",
                  "error"
                );
                return;
              }
            }
          }
          $http
            .post("http://localhost:8080/api/sanpham", {
              code: $scope.form.product.code,
              name: $scope.form.product.name,
              description: $scope.form.description,
            })
            .then(function (product) {
              //add voucher

              let listVoucher = $scope.voucherList;
              if (listVoucher.length > 0) {
                for (let i = 0; i < listVoucher.length; i++) {
                  var idV = document.getElementById(
                    "Voucher" + listVoucher[i].id
                  ).value;

                  $http.post("http://localhost:8080/api/productvoucher", {
                    idVoucher: idV,
                    idProduct: product.data.id,
                  });
                }
              }

              // if (product.status === 200){
              //add image

              var img = new FormData();
              img.append("files", MainImage[0]);
              $http
                .post("http://localhost:8080/api/upload", img, {
                  transformRequest: angular.identity,
                  headers: {
                    "Content-Type": undefined,
                  },
                })
                .then(function (upImage) {
                  $http
                    .post("http://localhost:8080/api/image", {
                      url: upImage.data[0],
                      mainImage: true,
                      idProduct: product.data.id,
                    })
                    .then(function (image) {
                      var ListImage = $scope.imagesList;
                      if (ListImage.length > 0) {
                        var img1 = new FormData();
                        for (let i = 0; i < ListImage.length; i++) {
                          img1.append("files", ListImage[i]);
                          $http
                            .post("http://localhost:8080/api/upload", img1, {
                              transformRequest: angular.identity,
                              headers: {
                                "Content-Type": undefined,
                              },
                            })
                            .then(function (imagelist) {
                              $http.post("http://localhost:8080/api/image", {
                                url: imagelist.data[i],
                                mainImage: false,
                                idProduct: product.data.id,
                              });
                            });
                        }
                      }
                    });
                });

              //add product detail
              $http
                .post("http://localhost:8080/api/product", {
                  price: $scope.form.price,
                  discount: phanTram,
                  description: $scope.form.description,
                  idCategory: $scope.get("category"),
                  idBrand: $scope.get("brand"),
                  idDesign: $scope.get("design"),
                  idProduct: product.data.id,     
                  discountDate: discountDate,
                })
                .then(function (productdetail) {
                  if (productdetail.status === 200) {
                    $http.post("http://localhost:8080/api/operationhistory", {
                      status: 1,
                      createBy: $rootScope.user.username,
                      idProductDetail: productdetail.data.id,
                    });
                    //add material
                    let listMaterial = $scope.listMaterial;
                    for (let i = 0; i < listMaterial.length; i++) {
                      var checkMaterial = document.getElementById(
                        "Material" + listMaterial[i].id
                      );
                      if (checkMaterial.checked == true) {
                        $http.post(
                          "http://localhost:8080/api/productdetail_material",
                          {
                            idProductDetail: productdetail.data.id,
                            idMaterial: listMaterial[i].id,
                          }
                        );
                      }
                    }
                    // add size and color

                    let listColor = $scope.listColor;
                    let listSize = $scope.listSize;

                    for (let i = 0; i < listColor.length; i++) {
                      let color = document.getElementById(
                        "Color" + listColor[i].id
                      );
                      if (color.checked == true) {
                        for (let j = 0; j < listSize.length; j++) {
                          let quantity = document.getElementById(
                            "Color" + listColor[i].id + "Size" + listSize[j].id
                          );

                          if (quantity !== null) {
                            if (quantity.value > 0) {
                              $http.post(
                                "http://localhost:8080/api/productdetail_color_size",
                                {
                                  idProductDetail: productdetail.data.id,
                                  idColor: listColor[i].id,
                                  idSize: listSize[j].id,
                                  quantity: quantity.value,
                                }
                              );
                            }
                          }
                        }
                      }
                    }      
                    Swal.fire("Thêm thành công !", "", "success");
                    setTimeout(() => {
                      location.href = "#/products/view";
                    }, 2000);
                  }
                })
                .catch(function (error) {
                  console.log(error.message);
                  Swal.fire("Thêm thất bại !", "", "error");
                });

              // }
            });
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
        }
        if (err.status === 404) {
          Swal.fire("Mã sản phẩm đã tồn tại !", "", "error");
          $scope.validationErrors = [];
        }
      });
  };
  //update product
  $scope.update = function () {
    let id = $routeParams.id;
    $http
      .get("http://localhost:8080/api/product/" + id)
      .then(function (detail) {
        $scope.history = detail.data;
      });
    $scope.get = function (name) {
      return document.getElementById(name).value;
    };
    let phanTram = 0;
    let discountDate = null;
    if (document.getElementById("giamGia").checked == true) {
      if (document.getElementById("khongGioiHan").checked == true) {
        phanTram = document.getElementById("phanTramGiamGia").value;
      } else {
        phanTram = document.getElementById("phanTramGiamGia1").value;
      }
    }
    if (document.getElementById("tamThoi").checked == true) {
      if (document.getElementById("thoiGianGiamGia").value === "") {
        Swal.fire("Vui lòng chọn thời gian kết thúc giảm giá !", "", "error");
        return;
      }
      discountDate = document.getElementById("thoiGianGiamGia").value;
    }
    console.log(discountDate);

    //validate
    $http
      .post("http://localhost:8080/api/product/validateupdate", {
        code: $scope.form.product.code,
        name: $scope.form.product.name,
        price: $scope.form.price,
        weight: $scope.form.weight,
        discount: phanTram,
        description: $scope.form.description,
      })
      .then(function (vali) {
        if (vali.status === 200) {
          //validate
          $scope.validationErrors = [];
          let indexMaterial = 0;
          for (let i = 0; i < $scope.listMaterial.length; i++) {
            let checkIndexMaterial = document.getElementById(
              "Material" + $scope.listMaterial[i].id
            );
            if (checkIndexMaterial.checked == true) {
              indexMaterial++;
            }
          }
          let indexColor = 0;
          for (let i = 0; i < $scope.listColor.length; i++) {
            let checkIndexColor = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (checkIndexColor.checked == true) {
              indexColor++;
            }
          }
          if (indexMaterial === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          if (indexColor === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          // check size and color

          for (let i = 0; i < $scope.listColor.length; i++) {
            let color = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (color.checked == true) {
              let iddexQuantity = 0;
              let check = 0;
              for (let j = 0; j < $scope.listSize.length; j++) {
                let quantity = document.getElementById(
                  "Color" +
                    $scope.listColor[i].id +
                    "Size" +
                    $scope.listSize[j].id
                );
                if (quantity === null) {
                  check++;
                }
                if (check === $scope.listSize.length) {
                  Swal.fire(
                    "Vui lòng thêm ít nhất 1 kích thước cho màu " +
                      $scope.listColor[i].name +
                      " !",
                    "",
                    "error"
                  );
                  return;
                }
                if (quantity !== null) {
                  if (quantity.value == 0) {
                    iddexQuantity++;
                  }
                  if (quantity.value < 0 || quantity > 999) {
                    Swal.fire(
                      "Số lượng size " +
                        $scope.listSize[j].name +
                        " màu " +
                        $scope.listColor[i].name +
                        " phải lớn hơn bằng 0 và nhỏ hơn 999 !",
                      "",
                      "error"
                    );
                    return;
                  }
                  if (quantity.value.trim() === "") {
                    Swal.fire(
                      "Số lượng size " +
                        $scope.listSize[j].name +
                        " màu " +
                        $scope.listColor[i].name +
                        " không được bỏ trống !",
                      "",
                      "error"
                    );
                    document.getElementById(
                      "Color" +
                        $scope.listColor[i].id +
                        "Size" +
                        $scope.listSize[j].id
                    ).value = 0;
                    return;
                  }
                }
              }
              if (iddexQuantity === $scope.listSize.length) {
                Swal.fire(
                  "Vui lòng nhập số lượng kích thước tối thiểu cho màu " +
                    $scope.listColor[i].name +
                    " !",
                  "",
                  "error"
                );
                return;
              }
            }
          }
          Swal.fire({
            title: "Bạn có chắc muốn sửa ?",
            showCancelButton: true,
            confirmButtonText: "Sửa",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // clear material and color size
              $http.delete(
                "http://localhost:8080/api/productdetail_material/" + id
              );
              $http.delete(
                "http://localhost:8080/api/productdetail_color_size/" + id
              );
              // update product detail
              $http
                .put("http://localhost:8080/api/product/update/" + id, {
                  price: $scope.form.price,            
                  discount: phanTram,
                  description: $scope.form.description,
                  idCategory: $scope.get("category"),
                  idBrand: $scope.get("brand"),
                  idDesign: $scope.get("design"),     
                  discountDate: discountDate,
                })
                .then(function (productDetail) {
                  $http.post("http://localhost:8080/api/operationhistory", {
                    status: 2,
                    createBy: $rootScope.user.username,
                    idProductDetail: productDetail.data.id,
                  });
                  //update product
                  $http
                    .put(
                      "http://localhost:8080/api/sanpham/" +
                        productDetail.data.product.id,
                      {
                        name: $scope.form.product.name,
                        description: $scope.form.description,
                      }
                    )
                    .then(function (product) {
                      $http.delete(
                        "http://localhost:8080/api/productvoucher/" +
                          product.data.id
                      );
                      let listVoucher = $scope.voucherList;
                      if (listVoucher.length > 0) {
                        for (let i = 0; i < listVoucher.length; i++) {
                          var idV = document.getElementById(
                            "Voucher" + listVoucher[i].id
                          ).value;
                          $http.post(
                            "http://localhost:8080/api/productvoucher",
                            {
                              idVoucher: idV,
                              idProduct: product.data.id,
                            }
                          );
                        }
                      }

                      // update image
                      var MainImage =
                        document.getElementById("fileUpload").files;
                      if (MainImage.length > 0) {
                        $http.delete(
                          "http://localhost:8080/api/image/" + product.data.id
                        );
                        var img = new FormData();
                        img.append("files", MainImage[0]);
                        $http
                          .post("http://localhost:8080/api/upload", img, {
                            transformRequest: angular.identity,
                            headers: {
                              "Content-Type": undefined,
                            },
                          })
                          .then(function (image) {
                            $http.post("http://localhost:8080/api/image", {
                              url: image.data[0],
                              mainImage: true,
                              idProduct: product.data.id,
                            });
                          });
                      }
                      var listImage = $scope.imagesList;

                      if (listImage.length > 0) {
                        var checkImg = true;

                        $http
                          .delete(
                            "http://localhost:8080/api/image/1/" +
                              product.data.id
                          )
                          .then(function () {
                            var img1 = new FormData();

                            for (var i = 0; i < listImage.length; i++) {
                              img1.append("files", listImage[i]);
                            }

                            $http
                              .post("http://localhost:8080/api/upload", img1, {
                                transformRequest: angular.identity,
                                headers: {
                                  "Content-Type": undefined,
                                },
                              })
                              .then(function (imageList) {
                                var promises = [];

                                for (
                                  var i = 0;
                                  i < imageList.data.length;
                                  i++
                                ) {
                                  promises.push(
                                    $http.post(
                                      "http://localhost:8080/api/image",
                                      {
                                        url: imageList.data[i],
                                        mainImage: false,
                                        idProduct: product.data.id,
                                      }
                                    )
                                  );
                                }

                                Promise.all(promises).then(function () {
                                  for (
                                    var i = 0;
                                    i < $scope.images.length;
                                    i++
                                  ) {
                                    if ($scope.images[i].startsWith("https")) {
                                      if ($scope.imageDelete.length > 0) {
                                        var deletePromises = [];

                                        for (
                                          var j = 0;
                                          j < $scope.imageDelete.length;
                                          j++
                                        ) {
                                          if (
                                            $scope.imageDelete[j] !==
                                            $scope.images[i]
                                          ) {
                                            deletePromises.push(
                                              $http.post(
                                                "http://localhost:8080/api/image",
                                                {
                                                  url: $scope.images[i],
                                                  mainImage: false,
                                                  idProduct: product.data.id,
                                                }
                                              )
                                            );
                                          }
                                        }

                                        Promise.all(deletePromises).then(
                                          function () {
                                            // Các hành động khác sau khi xử lý xóa ảnh
                                          }
                                        );
                                      } else {
                                        if (checkImg) {
                                          checkImg = false;
                                          $http
                                            .post(
                                              "http://localhost:8080/api/image",
                                              {
                                                url: $scope.images[i],
                                                mainImage: false,
                                                idProduct: product.data.id,
                                              }
                                            )
                                            .then(function () {
                                              // Các hành động khác sau khi thêm ảnh mới
                                            });
                                        }
                                      }
                                    }
                                  }
                                });
                              });
                          });
                      }

                      if (listImage.length == 0) {
                        if ($scope.imageDelete.length > 0) {
                          $http
                            .delete(
                              "http://localhost:8080/api/image/1/" +
                                product.data.id
                            )
                            .then(function () {
                              var promises = [];

                              for (var i = 0; i < $scope.images.length; i++) {
                                if ($scope.images[i].startsWith("http")) {
                                  promises.push(
                                    $http.post(
                                      "http://localhost:8080/api/image",
                                      {
                                        url: $scope.images[i],
                                        mainImage: false,
                                        idProduct: product.data.id,
                                      }
                                    )
                                  );
                                }
                              }

                              Promise.all(promises).then(function () {
                                // Các hành động khác sau khi xử lý thêm ảnh khi không có ảnh mới
                              });
                            });
                        }
                      }
                    });
                  //update material
                  let listMaterial = $scope.listMaterial;
                  for (let i = 0; i < listMaterial.length; i++) {
                    var checkMaterial = document.getElementById(
                      "Material" + listMaterial[i].id
                    );
                    if (checkMaterial.checked == true) {
                      $http.post(
                        "http://localhost:8080/api/productdetail_material",
                        {
                          idProductDetail: productDetail.data.id,
                          idMaterial: listMaterial[i].id,
                        }
                      );
                    }
                  }             

                  // update size and color

                  let listColor = $scope.listColor;
                  let listSize = $scope.listSize;
                  for (let i = 0; i < listColor.length; i++) {
                    let color = document.getElementById(
                      "Color" + listColor[i].id
                    );
                    if (color.checked == true) {
                      for (let j = 0; j < listSize.length; j++) {
                        let quantity = document.getElementById(
                          "Color" + listColor[i].id + "Size" + listSize[j].id
                        );
                        if (quantity !== null) {
                          $http.post(
                            "http://localhost:8080/api/productdetail_color_size",
                            {
                              idProductDetail: productDetail.data.id,
                              idColor: listColor[i].id,
                              idSize: listSize[j].id,
                              quantity: quantity.value,
                            }
                          );
                        }
                      }
                    }
                  }
                  let mangMaterial = "";
                  for (
                    let i = 0;
                    i < $scope.history.productDetail_materials.length;
                    i++
                  ) {
                    mangMaterial +=
                      $scope.history.productDetail_materials[i].material.id;
                    mangMaterial += ",";
                  }
                  let mangColorSize = "";
                  for (
                    let i = 0;
                    i < $scope.history.productDetail_size_colors.length;
                    i++
                  ) {
                    mangColorSize +=
                      $scope.history.productDetail_size_colors[i].color.id +
                      "-" +
                      $scope.history.productDetail_size_colors[i].size.id +
                      "-" +
                      $scope.history.productDetail_size_colors[i].quantity;
                    mangColorSize += ",";
                  }
                  let ImageList = "";
                  let ImageMain = "";
                  for (
                    let i = 0;
                    i < $scope.history.product.productImages.length;
                    i++
                  ) {
                    if (
                      $scope.history.product.productImages[i].mainImage === true
                    ) {
                      ImageMain = $scope.history.product.productImages[i].url;
                    }
                    if (
                      $scope.history.product.productImages[i].mainImage ===
                      false
                    ) {
                      ImageList += $scope.history.product.productImages[i].url;
                      ImageList += ",";
                    }
                  }
                  let mangVoucher = "";
                  if ($scope.history.product.product_vouchers.length > 0) {
                    for (
                      let i = 0;
                      i < $scope.history.product.product_vouchers.length;
                      i++
                    ) {
                      mangVoucher +=
                        $scope.history.product.product_vouchers[i].voucher.id;
                      mangVoucher += ",";
                    }
                  }
                  $http.post("http://localhost:8080/api/productdetailhistory", {
                    updateDate: new Date(),
                    updateBy: $rootScope.user.username,
                    name: $scope.history.product.name,
                    price: $scope.history.price,
                    weight: $scope.history.weight,
                    description: $scope.history.description,
                    idCategory: $scope.history.category.id,
                    idBrand: $scope.history.brand.id,               
                    idDesign: $scope.history.design.id,
                    idMaterial: mangMaterial,
                    idColor_Size_Quantity: mangColorSize,
                    idProductDetail: $scope.history.id,
                    imageMain: ImageMain,
                    imageList: ImageList,
                    idVoucher: mangVoucher,
                    discount: $scope.history.discount,
                    discountDate: $scope.history.discountDate,
                  });

                  Swal.fire("Sửa thành công !", "", "success");
                  setTimeout(() => {
                    location.href = "#/products/view";
                  }, 2000);
                })
                .catch(function (error) {
                  Swal.fire("Sửa thất bại !", "", "error");
                });
            }
          });
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
        }
      });
  };
  //detail product
  $scope.detail = function () {
    let id = $routeParams.id;
    $http
      .get("http://localhost:8080/api/product/" + id)
      .then(function (detail) {
        $scope.form = detail.data;
        if ($scope.form.discount > 0) {
          document.getElementById("giamGia").checked = true;
          document.getElementById("giamGia1").style.display = "block";
          if ($scope.form.discountDate != null) {
            document.getElementById("tamThoi").checked = true;
            document.getElementById("tamThoi1").style.display = "block";
            document.getElementById("phanTramGiamGia1").style.display = "block";
            document.getElementById("thoiGianGiamGia").style.display = "block";
            document.getElementById("phanTramGiamGia").style.display = "none";
            document.getElementById("phanTramGiamGia1").value =
              $scope.form.discount;
            // Get the input element
            let dateInput = document.getElementById("thoiGianGiamGia");

            // Original datetime string in 'yyyy-MM-dd hh:mm:ss.sss' format
            var originalDateStr = $scope.form.discountDate; // Replace with your original date

            // Split the original date string
            var dateParts = originalDateStr.split("T")[0].split("-");

            // Extract year, month, and day
            var year = dateParts[0];
            var month = dateParts[1];
            var day = dateParts[2];

            // Create the formatted date string in 'MM/dd/yyyy' format
            var formattedDate = year + "-" + month + "-" + day;

            // Set the formatted date in the input field'

            dateInput.value = formattedDate;
            var today = new Date().toISOString().split("T")[0];
            document.getElementById("thoiGianGiamGia").min = today;
          } else {
            document.getElementById("khongGioiHan").checked = true;
            document.getElementById("khongGioiHan1").style.display = "block";
            document.getElementById("phanTramGiamGia1").style.display = "none";
            document.getElementById("thoiGianGiamGia").style.display = "none";
            document.getElementById("phanTramGiamGia").style.display = "block";
            document.getElementById("phanTramGiamGia").value =
              $scope.form.discount;
          }
        }

        for (let i = 0; i < detail.data.product.productImages.length; i++) {
          if (detail.data.product.productImages[i].mainImage === false) {
            $scope.images.push(detail.data.product.productImages[i].url);
          }
        }
        for (let i = 0; i < detail.data.productDetail_materials.length; i++) {
          document.getElementById(
            "Material" + detail.data.productDetail_materials[i].material.id
          ).checked = true;
        }
        for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
          document.getElementById(
            "Color" + detail.data.productDetail_size_colors[i].color.id
          ).checked = true;
        }
        let listColor = $scope.listColor;
        for (let i = 0; i < listColor.length; i++) {
          var checkBox = document.getElementById("Color" + listColor[i].id);
          if (checkBox.checked == true) {
            $scope.checkbox(listColor[i].id);
          }
        }
        for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
          if (
            !$scope.colorSizes[
              detail.data.productDetail_size_colors[i].color.id
            ]
          ) {
            $scope.colorSizes[
              detail.data.productDetail_size_colors[i].color.id
            ] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
          }
          var newItem = {
            size: detail.data.productDetail_size_colors[i].size.id.toString(),
            quantity:
              detail.data.productDetail_size_colors[i].quantity.toString(),
          };

          // Thêm newItem vào mảng kích thước của màu sắc tương ứng
          $scope.colorSizes[
            detail.data.productDetail_size_colors[i].color.id
          ].push(newItem);
          // document.getElementById('Color'+detail.data.productDetail_size_colors[i].color.id + 'Size'+detail.data.productDetail_size_colors[i].size.id).value = detail.data.productDetail_size_colors[i].quantity;
        }

        for (let i = 0; i < detail.data.product.product_vouchers.length; i++) {
          var voucher = {
            id: detail.data.product.product_vouchers[i].voucher.id,
          };

          // Thêm newItem vào mảng kích thước của màu sắc tương ứng
          $scope.voucherList.push(voucher);

          // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
          $scope.voucher = {};
        }
      });
    $scope.listHistory = [];
    $http
      .get("http://localhost:8080/api/productdetailhistory/" + id)
      .then(function (response) {
        $scope.listHistory = response.data;
      });
    // pagation
    $scope.pagerHistory = {
      page: 0,
      size: 5,
      get items() {
        var start = this.page * this.size;
        return $scope.listHistory.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listHistory.length) / this.size);
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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // pagation
  $scope.pager = {
    page: 0,
    size: 5,
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
  //export exel
  $scope.exportToExcel = function () {
    Swal.fire({
      title: "Bạn có chắc muốn xuất Exel ?",
      showCancelButton: true,
      confirmButtonText: "Xuất",
    }).then((result) => {
      if (result.isConfirmed) {
        // Chuyển dữ liệu thành một mảng các đối tượng JSON
        var dataArray = $scope.list.map(function (item) {
          var Materials = item.productDetail_materials
            .map(function (detail) {
              return detail.material.name;
            })
            .join(", ");
          var Images = item.product.productImages
            .map(function (image) {
              return image.url;
            })
            .join(", ");
          var Color_Size = item.productDetail_size_colors
            .map(function (size) {
              return (
                "Color : " +
                size.color.name +
                " { Size " +
                size.size.name +
                " | Quantity : " +
                size.quantity +
                "}"
              );
            })
            .join(", ");
          return {
            Code: item.product.code,
            Name: item.product.name,
            Images: Images,
            Price: item.price,
            Weight: item.weight,
            Description: item.description,
            Discount: item.discount,
            Category: item.category.name,
            Brand: item.brand.name,         
            Materials: Materials,
            QuantityByColor_Sizes: Color_Size,
          };
        });

        // Tạo một workbook mới
        var workbook = XLSX.utils.book_new();

        // Tạo một worksheet từ dữ liệu
        var worksheet = XLSX.utils.json_to_sheet(dataArray);

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sheet");

        // Xuất tệp Excel
        XLSX.writeFile(workbook, "data" + new Date() + ".xlsx");
        Swal.fire("Xuất file exel thành công !", "", "success");
      }
    });
  };
  // search by name
  $scope.search = function () {
    var name = document.getElementById("name").value;
    if (name.trim().length === 0) {
      Swal.fire("Nhập tên trước khi tìm kiếm...", "", "error");
    } else {
      $http
        .get("http://localhost:8080/api/product/search/" + name)
        .then(function (search) {
          $scope.list = search.data;
          $scope.pager.first();
        });
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
};
