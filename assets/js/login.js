app.controller("loginController", function ($scope, $rootScope, $http, $window, $location) {
    $rootScope.message = "Trang Đăng Nhập";
    $scope.users = [];

    $scope.loadData = function () {
        $http.get("http://localhost:3000/users")
            .then(function (res) {
                $scope.users = res.data;
            });
    };

    $scope.loadData();

    $scope.loginUser = function () {
        if ($scope.myloginForm.$valid) {
            var loggedIn = false;
            for (let i = 0; i < $scope.users.length; i++) {
                if ($scope.user.Email === $scope.users[i].Email && $scope.user.MatKhau === $scope.users[i].MatKhau) {
                    $window.localStorage.setItem('user', JSON.stringify($scope.users[i]));
                    $scope.getUserInfo();
                    loggedIn = true;
                    break;
                }
            }

            if (loggedIn) {
                alert('Đăng nhập thành công!');
                $scope.loadCart()
                $location.path("/");
            } else {
                alert('Sai email hoặc mật khẩu!');
            }
        }
    };
    $scope.loadCart = function () {
        $http.get("http://localhost:3000/cart")
            .then(res => {
                $scope.cart = res.data;
                $scope.cartByUser = $scope.cart.find(item => item.MaTK === $rootScope.User.id);
                if ($scope.cartByUser) {
                    $scope.cartShow = $scope.cartByUser.items;
                    $rootScope.slcart=$scope.cartShow.length;
                } else {
                    $scope.cartShow = [];
                    $rootScope.slcart=0
                }
            });
    };
    $scope.getUserInfo = function() {
        var userInfo = $window.localStorage.getItem('user');
        if (userInfo) {
            $rootScope.User = JSON.parse(userInfo);
        }else{
            $rootScope.User = false
        }
    };
    $scope.getUserInfo();

    $rootScope.logout = function () {
        $window.localStorage.removeItem('user');
        $scope.getUserInfo();
        $window.location.reload();
    };
});
