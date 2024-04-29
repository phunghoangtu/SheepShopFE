var app = angular.module("myApp", ["ngRoute"]);

app.controller("SellController", function ($scope, $http) {

  $scope.showProducts = false;
  $scope.products = [
    { code: "P001", name: "Sản phẩm 1", price: "90$", quantity: "100" },
    { code: "P002", name: "Sản phẩm 2", price: "90$", quantity: "200" },
    { code: "P003", name: "Sản phẩm 3", price: "90$", quantity: "300" },
    { code: "P004", name: "Sản phẩm 4", price: "90$", quantity: "400" },
    { code: "P004", name: "Sản phẩm 5", price: "90$", quantity: "500" },
    { code: "P004", name: "Sản phẩm 7", price: "90$", quantity: "600" },
    { code: "P004", name: "Sản phẩm 8", price: "90$", quantity: "700" },
    { code: "P004", name: "Sản phẩm 9", price: "90$", quantity: "800" },
    { code: "P004", name: "Sản phẩm 10", price: "90$", quantity: "900" },
    { code: "P004", name: "Sản phẩm 11", price: "90$", quantity: "1000" },
    { code: "P004", name: "Sản phẩm 12", price: "90$", quantity: "1200" },
    { code: "P004", name: "Sản phẩm 13", price: "90$", quantity: "1300" },
    { code: "P004", name: "Sản phẩm 14", price: "90$", quantity: "1400" },
    { code: "P004", name: "Sản phẩm 15", price: "90$", quantity: "1500" },
    { code: "P004", name: "Sản phẩm 16", price: "90$", quantity: "1600" },
    { code: "P004", name: "Sản phẩm 17", price: "90$", quantity: "1800" },
    { code: "P004", name: "Sản phẩm 18", price: "90$", quantity: "1900" },
    { code: "P004", name: "Sản phẩm 19", price: "90$", quantity: "1700" },
    { code: "P004", name: "Sản phẩm 20", price: "90$", quantity: "2000" },
  ];

  $scope.search = function () {
    // Kiểm tra xem có dữ liệu nhập vào hay không
    if ($scope.query) {
      // Hiển thị danh sách sản phẩm
      $scope.showProducts = true;
    } else {
      // Ẩn danh sách sản phẩm nếu không có dữ liệu nhập vào
      $scope.showProducts = false;
    }
  };

  $scope.selectProduct = function (product) {
    // Xử lý khi người dùng chọn một sản phẩm từ danh sách
    console.log("Selected product:", product);
  };

  //////////////////////////////////////////////////////

  // Khai báo và gán giá trị cho currentDate và currentTime

  $scope.currentDate = new Date();
  $scope.currentTime = new Date();

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

  // tính số lượng và tổng tiền
  $scope.cartItems = [
    {
      code: "Code2644",
      name: "Ut voluptatem id earum et",
      quantity: 1,
      price: 500.0,
    },
    // Thêm các hàng khác vào đây
  ];

  $scope.getTotalQuantity = function () {
    var totalQuantity = 0;
    for (var i = 0; i < $scope.cartItems.length; i++) {
      totalQuantity += $scope.cartItems[i].quantity;
    }
    return totalQuantity;
  };

  $scope.increment = function (item) {
    item.quantity++;
    $scope.calculateAccumulatedPrice(); // Gọi hàm calculateAccumulatedPrice() để tính toán tổng
    $scope.khachThanhToan = $scope.khachCanTra(); // Gọi hàm để tính khách thanh toán
  };

  $scope.decrement = function (item) {
    if (item.quantity > 1) {
      item.quantity--;
      $scope.calculateAccumulatedPrice(); // Gọi hàm calculateAccumulatedPrice() để tính toán tổng
      $scope.khachThanhToan = $scope.khachCanTra(); // Gọi hàm để tính khách thanh toán
    }
  };

  // Trong AngularJS controller hoặc component
  $scope.accumulatedPrice = 0;

  $scope.calculateAccumulatedPrice = function () {
    $scope.accumulatedPrice = 0;
    for (var i = 0; i < $scope.cartItems.length; i++) {
      var item = $scope.cartItems[i];
      $scope.accumulatedPrice += item.price * item.quantity;
    }
  };

  // Gọi hàm calculateAccumulatedPrice() để tính toán tổng giá trị ban đầu
  $scope.calculateAccumulatedPrice();

  // Trong AngularJS controller hoặc component
  $scope.khachCanTra = function () {
    return $scope.accumulatedPrice;
  };

  $scope.khachThanhToan = $scope.khachCanTra(); // Gán giá trị khách cần trả cho khách thanh toán ban đầu

  $scope.tinhTienThua = function () {
    return $scope.khachThanhToan - $scope.accumulatedPrice;
  };

  //   crud bill

  const url = "http://localhost:8080/api/bill/paystatus";

  $scope.setBill = function (bill) {
    $scope.bill = bill;
  };

  var getAllBillChuaThanhToan = function () {
    $http.get(url).then(function (response) {
      $scope.bills = response.data;
    });
  };
  getAllBillChuaThanhToan();

  // Create
  $scope.addBill = function () {
    var bill = {
      user: $scope.user.id, // Lấy ID người dùng từ thông tin người dùng hiện tại
      customer: $scope.customer.id,
    };
    $http.post(url, bill).then(function (response) {
      alert("Tạo hóa đơn thành công");
    });
  };
  $scope.bill = {};

  // Delete
  $scope.deleteBillId = function (id) {
    $http.delete(url + "/" + id).then(function (response) {
      getAllBillChuaThanhToan();
      alert("Xóa thành công");
    });
  };
});
