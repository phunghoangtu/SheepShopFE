angular.module("myApp", []).controller("sellController", function ($scope) {
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

  $scope.scrollLeft = function () {
    var wrapper = document.querySelector(".scroll-wrapper");
    wrapper.scrollLeft -= 100;
  };

  $scope.scrollRight = function () {
    var wrapper = document.querySelector(".scroll-wrapper");
    wrapper.scrollLeft += 100;
  };

  /////////////////////////////////////////////////////////////

  $scope.invoices = [];
  $scope.invoiceCount = 0;
  $scope.createInvoice = function () {
    $scope.scrollRight(); // Gọi hàm scrollRight() để thực hiện cuộn sang phải
    if ($scope.invoices.length >= 5) {
      return alert("Đã đạt giới hạn, không tạo hóa đơn mới"); // Đã đạt giới hạn, không tạo hóa đơn mới
    }

    var invoiceCount = $scope.invoices.length + 1;
    var newInvoice = "Hóa đơn " + invoiceCount;
    $scope.invoices.push(newInvoice);
  };

  /////////////////////////////////////////////////////////////

  
  $scope.deleteInvoice = function(invoice) {
    $scope.invoices = $scope.invoices.filter(function(item) {
      return item !== invoice;
    });
  };
  
});
