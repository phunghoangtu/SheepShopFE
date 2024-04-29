window.LoginAdminController = function (
  $scope,
  $http,
  $location,
  $rootScope,
  AuthService
) {
  document.getElementById("main-wrapper").style.display = "none";
  document.getElementById("login").style.display = "block";
  $scope.loginAdmin = function () {
    $http
      .post("http://localhost:8080/api/auth/admin/login", {
        username: $scope.username,
        password: $scope.password,
      })
      .then(function (response) {
        if (response.status === 200) {
          var token = response.data.token;
          // Lưu token vào local storage hoặc session storage
          //    console.log(response.data.user.fullname);
          // AuthenticationService.setAuthentication(true, response.data.user);

          AuthService.saveToken(token); // Lưu token vào localStorage
          $http({
            method: "GET",
            url: "http://localhost:8080/api/auth/admin/get",
            params: { token: token },
          }).then(function (username) {
            $http
              .get(
                "http://localhost:8080/api/employee/getByUsername/" +
                  username.data.username
              )
              .then(function (user) {
                $rootScope.user = user.data;
                AuthService.saveId(user.data.id);
                AuthService.saveRole(user.data.role.id);
              });
          });

          // Redirect đến trang bảo mật hoặc thực hiện các hành động khác sau khi đăng nhập thành công
          document.getElementById("main-wrapper").style.display = "block";
          document.getElementById("login").style.display = "none";
          Swal.fire("Đăng nhập thành công !", "", "success");

          location.href = "#/chart/view";
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
          // Sử dụng $timeout để đặt thời gian hiển thị thông báo lỗi trong 3 giây
          $timeout(function () {
            $scope.validationErrors = null; // Ẩn thông báo lỗi sau 3 giây
          }, 3000);
        } else {
          Swal.fire("Tài khoản hoặc mật khẩu không đúng !", "", "error");
        }
      });
  };

  
};
